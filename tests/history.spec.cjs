// Run with: node --test tests/history.spec.cjs (requires Playwright and Edge).
// Catches lost history on reload, wrong archived files, and partial saves.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { pathToFileURL } = require('node:url');
const { createHash } = require('node:crypto');
const { chromium } = require('playwright');
let browser, server, base, serveLegacyScript = false;
const root = process.env.CAITANG_TEST_ROOT || path.join(__dirname, '..');
const fixture = name => path.join(__dirname, 'fixtures', name);
before(async () => {
  server = http.createServer(async (req, res) => {
    try {
      let name = new URL(req.url, 'http://localhost').pathname;
      const legacy = name.startsWith('/legacy/');
      if (legacy) name = name.slice(7);
      if (legacy && name === '/data.js') {
        res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
        res.end(await fs.readFile(fixture('legacy-data.js')));
        return;
      }
      if (name === '/cache-seed.html') {
        res.setHeader('Content-Type', 'text/html');
        res.end('<!doctype html><html><body><script src="app.js"></script></body></html>');
        return;
      }
      if (serveLegacyScript && name === '/app.js' && !req.url.includes('?')) {
        res.setHeader('Content-Type', 'text/javascript');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.end('document.body.dataset.legacyLoaded="yes";');
        return;
      }
      const file = path.join(root, name === '/' ? 'index.html' : name);
      const data = await fs.readFile(file);
      res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript; charset=utf-8' : file.endsWith('.css') ? 'text/css' : 'text/html; charset=utf-8');
      res.end(data);
    } catch { res.writeHead(404); res.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}/legacy/`;
  browser = await chromium.launch({ channel: 'msedge', headless: true });
});
after(async () => { await browser?.close(); await new Promise(resolve => server.close(resolve)); });
async function updates(page) {
  await page.getByRole('button', { name: '每周数据更新', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('[data-history-loading]'));
}
async function preview(page, name) {
  await page.locator('#fileInput').setInputFiles(fixture(name));
  await page.getByRole('button', { name: '确认更新看板', exact: true }).waitFor();
}
async function apply(page, name, asOf) {
  await preview(page, name);
  await page.locator('#importAsOf').fill(asOf);
  await page.getByRole('button', { name: '确认更新看板', exact: true }).click();
  await page.locator('#uploadDialog').waitFor({ state: 'hidden' });
}
async function downloadInitialWorkbook(page) {
  const original = page.locator('.history-initial').getByRole('button', { name: '下载原文件', exact: true });
  assert.equal(await original.count(), 1, 'initial record must offer its original workbook');
  const event = page.waitForEvent('download');
  await original.click();
  const saved = await event;
  assert.equal(saved.suggestedFilename(), '集团流程改革-彩棠试点项目工作计划.xlsx');
  const bytes = await fs.readFile(await saved.path());
  assert.equal(createHash('sha256').update(bytes).digest('hex'), '61f5ea5959d8c3c75eba3a671100e8e911dbc52653e5c11bec95fd6020adce63');
}

test('new progress workbook imports its explicit hierarchy and original actual dates', async () => {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto(base);
    const encoded = (await fs.readFile(fixture('new-progress.xlsx'))).toString('base64');
    const parsed = await page.evaluate(async encoded => {
      const sheets = await readXlsx(Uint8Array.from(atob(encoded), x => x.charCodeAt(0)).buffer);
      return parseModel({ ...source, sheets });
    }, encoded);
    assert.equal(parsed.stages.length, 6);
    assert.equal(parsed.nodes.length, 55);
    assert.equal(parsed.plans.length, 49);
    assert.equal(parsed.nodes.filter(x => x.leaf).length, 45);
    assert.equal(parsed.nodes.filter(x => x.leaf && x.status === '已完成').length, 21);
    const approval = parsed.plans.find(x => x.name === '新审批流设计');
    assert.equal(approval.actualEnd, '2026-10-16');
    assert.equal(approval.rawStatus, '进行中');
    assert.equal(parsed.stages[5].start, '2026-12-10');
    assert.equal(parsed.conclusions.length, 2);
  } finally { await context.close(); }
});

test('current dashboard shows six stages, combined date periods, hierarchy and key conclusions', async () => {
  const context = await browser.newContext({ viewport: { width: 1538, height: 950 } });
  try {
    const page = await context.newPage();
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(base.replace('/legacy/', '/'));
    assert.equal(await page.locator('.gantt-row').count(), 6);
    assert.match(await page.locator('.metrics').innerText(), /50/);
    assert.match(await page.locator('.conclusions').innerText(), /关键结论[\s\S]*本次不上线标准合同模板。[\s\S]*本次不上线预算自动释放功能。/);
    await page.getByRole('button', { name: '阶段计划 02', exact: true }).click();
    assert.equal(await page.locator('.progress-table tbody tr').count(), 55);
    assert.deepEqual((await page.locator('.progress-table th').allTextContents()).filter(Boolean), ['名称','主责部门','层级','计划周期','实际周期','阶段状态']);
    const design = page.locator('.progress-table tr[data-plan="progress-5"]');
    assert.equal(await design.locator('td').nth(3).innerText(), '08.27 — 10.16');
    assert.equal(await design.locator('td').nth(4).innerText(), '08.27 — /');
    assert.equal(await page.locator('.progress-table tr[data-plan="progress-56"] td').nth(4).innerText(), '/ — /');
    await page.getByRole('button', { name: '折叠功能需求设计', exact: true }).click();
    assert.equal(await page.locator('.progress-table tbody tr').count(), 45);
    await page.getByRole('button', { name: '展开功能需求设计', exact: true }).click();
    const approval = page.locator('.progress-table tr').filter({ hasText: '新审批流设计' });
    assert.match(await approval.innerText(), /10.08[\s\S]*10.16[\s\S]*10.08[\s\S]*10.16[\s\S]*进行中/);
    await approval.click();
    assert.match(await page.locator('#drawer').innerText(), /实际周期[\s\S]*2026-10-08 — 2026-10-16/);
    await page.getByRole('button', { name: '关闭计划详情', exact: true }).click();
    await page.getByRole('textbox', { name: '搜索细分计划' }).fill('预算管理');
    assert.equal(await page.locator('.progress-table tr').filter({ hasText: '1.预算管理' }).count(), 4);
    await page.getByRole('textbox', { name: '搜索细分计划' }).fill('');
    await page.getByRole('button', { name: '计划甘特', exact: true }).click();
    assert.equal(await page.locator('.hg-row:not(.hg-header)').count(), 55);
    assert.equal(await page.locator('.hg-weeks > div').count(), 19);
    await page.getByRole('button', { name: '上线试运行', exact: true }).click();
    assert.match(await page.locator('#planResults').innerText(), /12.10[\s\S]*未开始/);
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
});

test('detailed Gantt labels show periods without collisions after filtering, folding and resizing', async () => {
  const context = await browser.newContext({ viewport: { width: 1923, height: 872 } });
  try {
    const page = await context.newPage();
    await page.goto(base.replace('/legacy/', '/'));
    await page.getByRole('button', { name: '阶段计划 02', exact: true }).click();
    await page.getByRole('button', { name: '计划甘特', exact: true }).click();
    async function checkLabels() {
      assert.equal(await page.locator('.hg-plan-label').count(), await page.locator('.hg-plan').count());
      assert.equal(await page.locator('.hg-actual-label').count(), await page.locator('.hg-actual').count());
      for (const row of await page.locator('.hg-row:not(.hg-header)').all()) {
        const labels = row.locator('.hg-date-label'), track = await row.locator('.hg-track').boundingBox();
        const boxes = await Promise.all((await labels.all()).map(label => label.boundingBox()));
        for (const box of boxes) assert.ok(box.x >= track.x - 1 && box.x + box.width <= track.x + track.width + 1, 'period labels must not be clipped');
        if (boxes.length === 2) {
          const [p, a] = boxes;
          assert.ok(Math.abs(p.y - a.y) < 1, 'both periods stay on one line');
          assert.ok(p.x + p.width + 5 <= a.x || a.x + a.width + 5 <= p.x, 'period labels must not overlap');
        }
      }
    }
    assert.match(await page.locator('.hg-row[data-plan="progress-5"]').innerText(), /计划 08.27 — 10.16[\s\S]*实际 08.27 — 进行中/);
    assert.match(await page.locator('.hg-row[data-plan="progress-17"]').innerText(), /实际 10.08 — 10.16/);
    assert.match(await page.locator('.hg-row[data-plan="progress-56"]').innerText(), /计划 12.10 — 12.10/);
    await checkLabels();
    await page.getByRole('button', { name: '折叠功能需求设计', exact: true }).click();
    await checkLabels();
    await page.getByRole('textbox', { name: '搜索细分计划' }).fill('预算管理');
    await checkLabels();
    await page.setViewportSize({ width: 1186, height: 872 });
    await page.evaluate(() => positionGanttLabels());
    await checkLabels();
  } finally { await context.close(); }
});

test('new workbook downloads unchanged and repeated imports persist after reload and offline export', async () => {
  const context = await browser.newContext({ acceptDownloads: true });
  try {
    const page = await context.newPage();
    await page.goto(base.replace('/legacy/', '/')); await updates(page);
    const event = page.waitForEvent('download');
    await page.locator('.history-bundled').getByRole('button', { name: '下载原文件', exact: true }).click();
    const file = await event;
    assert.equal(file.suggestedFilename(), '彩棠工作台项目进度表.xlsx');
    assert.deepEqual(await fs.readFile(await file.path()), await fs.readFile(fixture('new-progress.xlsx')));
    await downloadInitialWorkbook(page);
    await apply(page, 'new-progress.xlsx', '2026-10-01');
    await page.reload(); await updates(page);
    assert.equal(await page.locator('.history-record').count(), 1);
    await page.getByRole('button', { name: '项目总览 01', exact: true }).click();
    assert.equal(await page.locator('.gantt-row').count(), 6);
    const reportEvent=page.waitForEvent('download');
    await page.getByRole('button', { name: '导出汇报版', exact: true }).click();
    const report=await reportEvent,reportPath=(await report.path())+'.html';await report.saveAs(reportPath);
    const offline=await context.newPage();await offline.goto(pathToFileURL(reportPath).href);
    assert.equal(await offline.locator('.gantt-row').count(),6);
    await updates(offline);
    assert.equal(await offline.locator('.history-bundled').count(),1);
    await offline.getByRole('button', { name: '阶段计划 02', exact: true }).click();
    assert.equal(await offline.locator('.progress-table tbody tr').count(),55);
  } finally { await context.close(); }
});

test('old stored data does not replace the new published workbook and its archive stays downloadable', async () => {
  const context=await browser.newContext({acceptDownloads:true});
  try {
    const page=await context.newPage();await page.goto(base.replace('/legacy/','/'));await updates(page);
    const old=JSON.parse((await fs.readFile(fixture('legacy-data.js'),'utf8')).replace(/^window.INITIAL_DATA=/,'').replace(/;$/,''));
    const encoded=(await fs.readFile(fixture('week-1.xlsx'))).toString('base64');
    await page.evaluate(async ({old,encoded})=>{
      await storeImport({id:'old-import',name:'old-week.xlsx',createdAt:1,time:'旧版记录',changes:1,asOf:old.asOf,snapshot:old},new Blob([Uint8Array.from(atob(encoded),c=>c.charCodeAt(0))]));
    },{old,encoded});
    await page.reload();assert.equal(await page.locator('.gantt-row').count(),6);await updates(page);
    assert.equal(await page.locator('.history-record').count(),1);
    const event=page.waitForEvent('download');await page.locator('.history-record').getByRole('button',{name:'下载原文件',exact:true}).click();
    assert.deepEqual(await fs.readFile(await (await event).path()),await fs.readFile(fixture('week-1.xlsx')));
  } finally {await context.close()}
});
test('Gantt today marker follows Beijing date independently of the uploaded report date', async () => {
  const context = await browser.newContext({ timezoneId: 'America/Los_Angeles' });
  try {
    const page = await context.newPage();
    await page.clock.install({ time: new Date('2026-09-29T16:00:00Z') });
    await page.goto(base);
    assert.equal(await page.locator('.today-line span').innerText(), '今天 09.30');
    assert.equal(await page.evaluate(() => source.asOf), '2026-09-29');
    const position = await page.locator('.today-line').first().evaluate(el => parseFloat(el.style.left));
    assert.ok(Math.abs(position - 60 / 137 * 100) < 0.001, 'marker must occupy September 30 on the monthly scale (August 1 to December 16)');
    await page.getByRole('button', { name: '周视图', exact: true }).click();
    assert.equal(await page.locator('.today-line span').innerText(), '今天 09.30');
    assert.match(await page.locator('.months').innerText(), /09.14 — 09.20/);
  } finally { await context.close(); }
});

test('Gantt marker moves at Beijing midnight without changing uploaded statuses or progress', async () => {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.clock.install({ time: new Date('2026-09-29T15:59:58Z') });
    await page.clock.pauseAt(new Date('2026-09-29T15:59:58Z'));
    await page.goto(base);
    assert.equal(await page.locator('.today-line span').innerText(), '今天 09.29');
    const before = await page.locator('.today-line').first().getAttribute('style');
    const statuses = await page.locator('.stage-state').allTextContents();
    const progress = await page.locator('.actual-line').evaluateAll(els => els.map(el => el.style.cssText));
    await page.clock.runFor(2200);
    assert.equal(await page.locator('.today-line span').innerText(), '今天 09.30');
    assert.notEqual(await page.locator('.today-line').first().getAttribute('style'), before);
    assert.deepEqual(await page.locator('.stage-state').allTextContents(), statuses);
    assert.deepEqual(await page.locator('.actual-line').evaluateAll(els => els.map(el => el.style.cssText)), progress);
    assert.equal(await page.evaluate(() => source.asOf), '2026-09-29');
  } finally { await context.close(); }
});

test('returning to a sleeping tab refreshes the current day and the weekly window', async () => {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.clock.install({ time: new Date('2026-09-29T02:00:00Z') });
    await page.goto(base);
    await page.getByRole('button', { name: '周视图', exact: true }).click();
    await page.clock.setSystemTime(new Date('2026-10-05T02:00:00Z'));
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    assert.equal(await page.locator('.today-line span').innerText(), '今天 10.05');
    assert.match(await page.locator('.months').innerText(), /09.21 — 09.27/);
    await page.clock.setSystemTime(new Date('2026-10-12T02:00:00Z'));
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    assert.equal(await page.locator('.today-line span').innerText(), '今天 10.12');
    assert.match(await page.locator('.months').innerText(), /09.28 — 10.04/);
    assert.equal(await page.locator('[data-gran="week"].selected').count(), 1);
  } finally { await context.close(); }
});

test('planned and actual Gantt bars overlap translucently and preserve their own start dates', async () => {
  const context = await browser.newContext({ viewport: { width: 1538, height: 900 } });
  try {
    const page = await context.newPage();
    await page.clock.install({ time: new Date('2026-09-29T02:00:00Z') });
    await page.goto(base);
    const row = page.locator('.gantt-row[data-stage="3"]');
    const implementation = page.locator('.gantt-row[data-stage="4"]');
    async function checkPlanLabelInsideLightBar() {
      const planned = await implementation.locator('.plan-line').boundingBox();
      const actual = await implementation.locator('.actual-line').boundingBox();
      const label = await implementation.locator('.plan-lane .range-label').boundingBox();
      assert.ok(label.y >= planned.y && label.y + label.height <= planned.y + planned.height + 1, 'planned dates must be vertically inside the planned bar');
      assert.ok(label.x >= actual.x + actual.width, 'planned dates should occupy the exposed light portion');
      assert.ok(label.x + label.width <= planned.x + planned.width, 'planned dates must fit inside the planned bar');
      const actualLabel = await implementation.locator('.actual-lane .range-label').boundingBox();
      assert.ok(actualLabel.y >= actual.y && actualLabel.y + actualLabel.height <= actual.y + actual.height + 1, 'actual dates must be vertically inside the dark bar');
      assert.ok(actualLabel.x >= actual.x && actualLabel.x + actualLabel.width <= actual.x + actual.width, 'actual dates must fit inside the dark bar');
    }
    await checkPlanLabelInsideLightBar();
    await page.setViewportSize({ width: 1186, height: 900 });
    await checkPlanLabelInsideLightBar();
    await page.setViewportSize({ width: 1538, height: 900 });

    const plan = await row.locator('.plan-line').boundingBox();
    const actual = await row.locator('.actual-line').boundingBox();
    assert.equal(plan.y, actual.y, 'both ranges must share a single bar row');
    assert.equal(plan.height, actual.height);
    const appearance = await row.evaluate(el => { const p = getComputedStyle(el.querySelector('.plan-line')), a = getComputedStyle(el.querySelector('.actual-line')); return { plan: p.backgroundColor, actual: a.backgroundColor, outline: p.borderTopStyle, actualOutline: a.borderLeftStyle, planOpacity: Number(p.opacity), actualOpacity: Number(a.opacity) }; });
    assert.equal(appearance.plan, 'rgb(233, 231, 250)', 'keep the original lavender plan color');
    assert.ok(appearance.planOpacity > 0 && appearance.planOpacity < 1);
    assert.equal(appearance.actual, 'rgb(113, 128, 227)', 'keep the original actual stage color');
    assert.ok(appearance.actualOpacity > 0 && appearance.actualOpacity < 1);
    assert.equal(appearance.outline, 'none', 'plan bar must have no outline');
    assert.equal(appearance.actualOutline, 'none');
    assert.ok(Math.abs(plan.x - actual.x) < 1, 'matching start dates share the same horizontal coordinate');
    assert.match(await row.innerText(), /计划 08.27 — 10.16/);
    assert.match(await row.innerText(), /实际 08.27 — 进行中/);
    await page.evaluate(() => { source.stages[3].actualStart = '2026-09-05'; render(); });
    const shifted = await row.locator('.actual-line').boundingBox();
    assert.ok(shifted.x > plan.x, 'a delayed actual start must move only the actual bar');
    assert.match(await row.innerText(), /计划 08.27 — 10.16/);
    assert.match(await row.innerText(), /实际 09.05 — 进行中/);
    await page.getByRole('button', { name: '周视图', exact: true }).click();
    const weeklyPlan = await row.locator('.plan-line').boundingBox();
    const weeklyActual = await row.locator('.actual-line').boundingBox();
    assert.equal(weeklyPlan.y, weeklyActual.y);
    await checkPlanLabelInsideLightBar();
    assert.match(await row.innerText(), /计划 08.27 — 10.16/);
    assert.match(await row.innerText(), /实际 09.05 — 进行中/);
    await page.evaluate(() => { source.stages[1].actualStart = '2026-09-21'; source.stages[1].actualEnd = '2026-09-23'; render(); });
    const separateRange = page.locator('.gantt-row[data-stage="1"]');
    assert.equal(await separateRange.locator('.plan-line').count(), 0);
    assert.equal(await separateRange.locator('.actual-line').count(), 1, 'actual period remains visible even when the original plan is outside the window');
  } finally { await context.close(); }
});

test('Gantt dates stay side by side without collisions at different widths and overlapping periods', async () => {
  const context = await browser.newContext({ viewport: { width: 1923, height: 872 } });
  try {
    const page = await context.newPage();
    await page.clock.install({ time: new Date('2026-09-29T02:00:00Z') });
    await page.goto(base.replace('/legacy/', '/'));
    async function checkDates() {
      const rows = page.locator('.gantt-row');
      for (let i = 0; i < await rows.count(); i++) {
        const row = rows.nth(i), p = row.locator('.plan-lane .range-label'), a = row.locator('.actual-lane .range-label');
        if (!await p.count() || !await a.count()) continue;
        const plan = await p.boundingBox(), actual = await a.boundingBox(), track = await row.locator('.track').boundingBox();
        assert.ok(Math.abs(plan.y - actual.y) < 1, `row ${i}: date labels must share one line`);
        assert.ok(plan.x + plan.width + 5 <= actual.x || actual.x + actual.width + 5 <= plan.x, `row ${i}: dates must not collide`);
        for (const box of [plan, actual]) assert.ok(box.x >= track.x - 1 && box.x + box.width <= track.x + track.width + 1, `row ${i}: dates must stay within the timeline`);
      }
    }
    for (const width of [1923, 1538, 1186, 780]) {
      await page.setViewportSize({ width, height: 872 });
      await page.evaluate(() => positionGanttLabels());
      await checkDates();
    }
    // Matching periods near the right edge and partially overlapping periods need the same protection.
    await page.evaluate(() => {
      model.stages[1].start = model.stages[1].actualStart = '2026-12-08';
      model.stages[1].end = model.stages[1].actualEnd = '2026-12-10';
      model.stages[2].actualStart = '2026-08-20'; model.stages[2].actualEnd = '2026-09-05';
      $('#main').innerHTML = overview(); bind(); positionGanttLabels();
    });
    await checkDates();
    await page.getByRole('button', { name: '周视图', exact: true }).click();
    await checkDates();
  } finally { await context.close(); }
});

test('new deployment loads current code when the browser has an old app.js cached', async () => {
  const context = await browser.newContext({ acceptDownloads: true });
  try {
    const page = await context.newPage();
    serveLegacyScript = true;
    await page.goto(base + 'cache-seed.html');
    assert.equal(await page.locator('body').getAttribute('data-legacy-loaded'), 'yes');
    serveLegacyScript = false;
    await page.goto(base);
    assert.notEqual(await page.locator('body').getAttribute('data-legacy-loaded'), 'yes', 'new page must not load the old cached script');
    await updates(page);
    await downloadInitialWorkbook(page);
  } finally { serveLegacyScript = false; await context.close(); }
});
test('initial record downloads the exact user-provided Excel file', async () => {
  const context = await browser.newContext({ acceptDownloads: true });
  try {
    const page = await context.newPage();
    await page.goto(base); await updates(page);
    await downloadInitialWorkbook(page);
  } finally { await context.close(); }
});
test('confirmed Excel imports survive reload with their original files and latest dashboard', async () => {
  const context = await browser.newContext({ acceptDownloads: true });
  try {
    const page = await context.newPage();
    await page.goto(base); await updates(page);
    await apply(page, 'week-1.xlsx', '2026-09-29');
    await page.reload(); await updates(page);
    assert.equal(await page.locator('.history-record').count(), 1, 'confirmed import must survive refresh');
    await apply(page, 'week-2.xlsx', '2026-10-06');
    await page.reload(); await updates(page);
    assert.equal(await page.locator('.history-record').count(), 2);
    const first = page.locator('.history-record').filter({ hasText: 'week-1.xlsx' });
    const saved = page.waitForEvent('download');
    await first.getByRole('button', { name: '下载原文件', exact: true }).click();
    const download = await saved;
    assert.equal(download.suggestedFilename(), 'week-1.xlsx');
    assert.deepEqual(await fs.readFile(await download.path()), await fs.readFile(fixture('week-1.xlsx')));
    await page.getByRole('button', { name: '阶段计划 02', exact: true }).click();
    const currentRow = page.locator('#planResults tr').filter({ hasText: '项目看板设计' });
    assert.match(await currentRow.innerText(), /已完成/);
    await page.getByRole('button', { name: '项目总览 01', exact: true }).click();
    assert.equal(await page.locator('.page-head .subtitle').innerText(), '计划周期 2026.08.03 — 2026.12.09');
    await updates(page);
    assert.match(await page.locator('.page-head .subtitle').innerText(), /2026-10-06/);
    await preview(page, 'week-1.xlsx');
    await page.getByRole('button', { name: '取消', exact: true }).click();
    await page.locator('#fileInput').setInputFiles({ name: 'broken.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.from('invalid') });
    await page.getByRole('heading', { name: '暂时无法导入' }).waitFor();
    await page.reload(); await updates(page);
    assert.equal(await page.locator('.history-record').count(), 2, 'cancelled and invalid files must not be saved');
  } finally { await context.close(); }
});
test('storage failure leaves the current dashboard unchanged and allows retry', async () => {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto(base); await updates(page);
    await preview(page, 'week-1.xlsx');
    await page.evaluate(() => {
      const original = IDBDatabase.prototype.transaction;
      IDBDatabase.prototype.transaction = function(names, mode, ...rest) {
        if (mode === 'readwrite') throw new DOMException('Test quota failure', 'QuotaExceededError');
        return original.call(this, names, mode, ...rest);
      };
    });
    await page.getByRole('button', { name: '确认更新看板', exact: true }).click();
    await page.locator('#historySaveError').waitFor();
    assert.match(await page.locator('#historySaveError').innerText(), /未更新/);
    assert.equal(await page.getByRole('button', { name: '确认更新看板', exact: true }).isEnabled(), true);
    await page.reload(); await updates(page);
    assert.equal(await page.locator('.history-record').count(), 0);
    await page.getByRole('button', { name: '阶段计划 02', exact: true }).click();
    assert.equal(await page.locator('#planResults tbody tr').count(), 39);
  } finally { await context.close(); }
});
test('exported standalone report opens offline and retains its own import history', async () => {
  const context = await browser.newContext({ acceptDownloads: true });
  try {
    const page = await context.newPage();
    await page.goto(base); await updates(page);
    await apply(page, 'week-2.xlsx', '2026-10-06');
    const exportEvent = page.waitForEvent('download');
    await page.getByRole('button', { name: '导出汇报版', exact: true }).click();
    const report = await exportEvent;
    const reportPath = (await report.path()) + '.html';
    await report.saveAs(reportPath);
    const offline = await context.newPage();
    const errors = [];
    offline.on('pageerror', error => errors.push(error.message));
    await offline.goto(pathToFileURL(reportPath).href); await updates(offline);
    assert.match(await offline.locator('body').innerText(), /2026-10-06/);
    await downloadInitialWorkbook(offline);
    await apply(offline, 'week-1.xlsx', '2026-10-07');
    await offline.reload(); await updates(offline);
    assert.equal(await offline.locator('.history-record').count(), 1);
    assert.match(await offline.locator('body').innerText(), /2026-10-07/);
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
});

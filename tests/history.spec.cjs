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
      const name = new URL(req.url, 'http://localhost').pathname;
      if (name === '/cache-seed.html') {
        res.setHeader('Content-Type', 'text/html');
        res.end('<!doctype html><html><body><script src="app.js"></script></body></html>');
        return;
      }
      if (serveLegacyScript && req.url === '/app.js') {
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
  base = `http://127.0.0.1:${server.address().port}/`;
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
    assert.match(await page.locator('body').innerText(), /2026.10.06|2026-10-06/);
    await updates(page); await preview(page, 'week-1.xlsx');
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

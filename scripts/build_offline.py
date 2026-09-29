"""Build a standalone HTML from the checked-in dashboard assets."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
html = (ROOT / 'index.html').read_text(encoding='utf-8')
css = (ROOT / 'style.css').read_text(encoding='utf-8')
js = (ROOT / 'app.js').read_text(encoding='utf-8')
original_js = (ROOT / 'original-excel.js').read_text(encoding='utf-8')
data = (ROOT / 'data.js').read_text(encoding='utf-8')
initial = json.loads(data.removeprefix('window.INITIAL_DATA=').removesuffix(';'))

def safe(value):
    return json.dumps(value, ensure_ascii=False).replace('<', '\\u003c')

bootstrap = (
    '<script>window.INITIAL_DATA=' + safe(initial)
    + ';window.BUNDLED_CSS=' + safe(css)
    + ';window.BUNDLED_JS=' + safe(js)
    + ';window.BUNDLED_SHELL=' + safe(html) + ';</script>'
)
standalone = (
    html.replace('<link rel="stylesheet" href="style.css">', '<style>' + css + '</style>')
    .replace('<script src="data.js"></script>', bootstrap)
    .replace('<script src="original-excel.js"></script>', '<script>' + original_js + '</script>')
    .replace('<script src="app.js"></script>', '<script>' + js.replace('</script', '<\\/script') + '</script>')
)
destination = ROOT / 'downloads' / '彩棠项目驾驶舱.html'
destination.parent.mkdir(parents=True, exist_ok=True)
destination.write_text(standalone, encoding='utf-8')
print(destination)

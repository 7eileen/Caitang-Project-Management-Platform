"""Version online assets by content, then build a standalone HTML report."""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def safe(value):
    return json.dumps(value, ensure_ascii=False).replace('<', '\\u003c')

def asset_tag(name):
    suffix = re.escape(name) + r'(?:\?[^\"]*)?'
    return (r'<link rel="stylesheet" href="' + suffix + r'">'
            if name.endswith('.css') else r'<script src="' + suffix + r'"></script>')

def build(root=ROOT, destination=None):
    root = Path(root)
    html = (root / 'index.html').read_text(encoding='utf-8')
    names = ['style.css', 'data.js', 'original-excel.js', 'app.js']
    assets = {name: (root / name).read_text(encoding='utf-8') for name in names}
    for name in names:
        version = hashlib.sha256((root / name).read_bytes()).hexdigest()[:12]
        url = name + '?v=' + version
        tag = ('<link rel="stylesheet" href="' + url + '">' if name.endswith('.css')
               else '<script src="' + url + '"></script>')
        html, count = re.subn(asset_tag(name), lambda match: tag, html)
        if count != 1:
            raise ValueError('Expected exactly one asset tag: ' + name)
    (root / 'index.html').write_text(html, encoding='utf-8', newline='\n')
    css, js = assets['style.css'], assets['app.js']
    initial = json.loads(assets['data.js'].removeprefix('window.INITIAL_DATA=').removesuffix(';'))
    replacements = {
        'style.css': '<style>' + css + '</style>',
        'data.js': '<script>window.INITIAL_DATA=' + safe(initial)
            + ';window.BUNDLED_CSS=' + safe(css)
            + ';window.BUNDLED_JS=' + safe(js)
            + ';window.BUNDLED_SHELL=' + safe(html) + ';</script>',
        'original-excel.js': '<script>' + assets['original-excel.js'] + '</script>',
        'app.js': '<script>' + js.replace('</script', '<\\/script') + '</script>',
    }
    standalone = html
    for name, content in replacements.items():
        standalone = re.sub(asset_tag(name), lambda match: content, standalone)
    destination = Path(destination) if destination else root / 'downloads' / '彩棠项目驾驶舱.html'
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(standalone, encoding='utf-8')
    return destination

if __name__ == '__main__':
    print(build())

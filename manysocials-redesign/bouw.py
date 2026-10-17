# Bouwt de publiceerbare pagina: CSS en JS inline, en een lokale voorbeeldversie met het artifact-skelet.
import sys, pathlib
basis = pathlib.Path(__file__).parent
def bouw(bron, uit, css, js_bestanden):
    h = (basis / bron).read_text()
    h = h.replace('<link rel="stylesheet" href="%s"><!--CSS-->' % css, '<style>\n' + (basis / 'dev' / css).read_text() + '\n</style>')
    for js in js_bestanden:
        tag = '<script src="%s"></script>' % js
        i = h.find(tag)
        assert i >= 0, js
        einde = h.find('-->', i) + 3
        h = h[:i] + '<script>\n' + (basis / 'dev' / js).read_text() + '\n</script>' + h[einde:]
    (basis / uit).write_text(h)
    skelet = ('<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover">'
              '<style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
              'html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}'
              'img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style></head><body>\n')
    (basis / ('dev/voorbeeld-' + pathlib.Path(uit).name)).write_text(skelet + h + '\n</body></html>')
    print(uit, len(h.encode()), 'bytes')
if len(sys.argv) == 1:
    bouw('dev/bron.html', 'index.html', 'pagina.css', ['zakken.js', 'pagina.js'])

# Pizzapresentatie: zelfde hand en statusbalk als de chipsversie.
def bouw_pizza():
    d = basis / 'dev-pizza'
    h = (d / 'bron.html').read_text()
    status = ('<div class="status" aria-hidden="true"><span>9:41</span><span class="status-r">'
              '<svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx=".8"/><rect x="5" y="5.5" width="3" height="6.5" rx=".8"/><rect x="10" y="3" width="3" height="9" rx=".8"/><rect x="15" y="0" width="3" height="12" rx=".8"/></svg>'
              '<svg viewBox="0 0 16 12"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.3A10.3 10.3 0 0 0 8 .4 10.3 10.3 0 0 0 .8 3.3L2 4.6a8.6 8.6 0 0 1 6-2.4zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.6 6.6 0 0 0 8 4a6.6 6.6 0 0 0-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3zm0 3.5c.4 0 .8.2 1.1.4L8 11.6 6.9 9.7c.3-.2.7-.4 1.1-.4z"/></svg>'
              '<svg viewBox="0 0 27 12"><rect x=".5" y=".5" width="22" height="11" rx="3.2" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="19" height="8" rx="2"/><path d="M24.5 4v4c.8-.3 1.5-1 1.5-2s-.7-1.7-1.5-2z" opacity=".4"/></svg>'
              '</span></div>')
    h = h.replace('<!--STATUS-->', status)
    h = h.replace('<!--HAND-->', (d / 'hand.svg.html').read_text())
    h = h.replace('<link rel="stylesheet" href="pizza.css"><!--CSS-->', '<style>\n' + (d / 'pizza.css').read_text() + '\n</style>')
    h = h.replace('<script src="pizza.js"></script><!--JS-->', '<script>\n' + (d / 'pizza.js').read_text() + '\n</script>')
    assert '<!--' not in h.replace('<!-- ', '')
    (basis / 'pizza.html').write_text(h)
    v = d / 'voorbeeld'
    v.mkdir(exist_ok=True)
    skelet = ('<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover">'
              '<style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
              'body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}'
              'img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style></head><body>\n')
    (v / 'index.html').write_text(skelet + h + '\n</body></html>')
    print('pizza.html', len(h.encode()), 'bytes')

if len(sys.argv) > 1 and sys.argv[1] == 'pizza':
    bouw_pizza()

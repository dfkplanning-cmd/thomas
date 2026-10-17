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
bouw('dev/bron.html', 'index.html', 'pagina.css', ['zakken.js', 'pagina.js'])

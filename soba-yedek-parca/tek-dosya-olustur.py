"""index.html + assets/* -> soba-fiyat-tek-dosya.html (CSS/JS gömülü, telefonda direkt açılır)."""
import os, re
d = os.path.dirname(os.path.abspath(__file__))
oku = lambda p: open(os.path.join(d, p), encoding="utf-8").read()
s = oku("index.html")
s = re.sub(r'<link rel="stylesheet" href="assets/style\.css[^"]*">', lambda m: "<style>\n" + oku("assets/style.css") + "\n</style>", s)
for js in ("fiyatlar", "app"):
    s = re.sub(r'<script src="assets/%s\.js[^"]*"></script>' % js,
               lambda m: "<script>\n" + oku("assets/%s.js" % js).replace("</script", "<\\/script") + "\n</script>", s)
assert "assets/" not in s
open(os.path.join(d, "soba-fiyat-tek-dosya.html"), "w", encoding="utf-8").write(s)
print("ok")

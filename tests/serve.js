// Static server for the tests. It sends the same headers as vercel.json (including the CSP), so a
// change that the real site would block fails here too.
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const headers = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8')).headers[0].headers.map(h => [h.key, h.value]));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const port = +process.env.PORT || 4173;
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream', ...headers });
  fs.createReadStream(f).pipe(res);
}).listen(port, () => console.log('serving on http://localhost:' + port));

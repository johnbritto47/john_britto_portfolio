const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const VISITOR_COUNT_FILE = path.join(ROOT, 'visitor-count.json');

let visitorCount = 0;
try {
  const savedCount = JSON.parse(fs.readFileSync(VISITOR_COUNT_FILE, 'utf8')).count;
  if (!Number.isSafeInteger(savedCount) || savedCount < 0) {
    throw new Error('Saved visitor count must be a non-negative integer');
  }
  visitorCount = savedCount;
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error;
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const requestPath = req.url.split('?')[0];

  if (requestPath === '/api/visitors') {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8', Allow: 'POST' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }

    const nextCount = visitorCount + 1;
    try {
      fs.writeFileSync(VISITOR_COUNT_FILE, JSON.stringify({ count: nextCount }));
      visitorCount = nextCount;
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      });
      res.end(JSON.stringify({ count: visitorCount }));
    } catch (error) {
      console.error('Failed to save visitor count:', error);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Unable to save visitor count' }));
    }
    return;
  }

  const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const safePath = path.normalize(urlPath).replace(/^\.+[\\/]+/, '');
  const filePath = path.join(ROOT, safePath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Internal server error');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});

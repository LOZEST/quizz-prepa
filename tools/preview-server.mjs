import http from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';

const root = resolve(process.cwd());
const host = '127.0.0.1';
const port = 4173;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

function safeFile(pathname) {
  const requested = pathname === '/' ? '/quiz.html' : pathname;
  const file = resolve(root, `.${requested}`);
  if (file !== root && !file.startsWith(`${root}${sep}`)) return null;
  return file;
}

http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${host}`).pathname);
  const file = safeFile(pathname);

  try {
    if (!file || !statSync(file).isFile()) throw new Error('Not found');
    response.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
    response.setHeader('Cache-Control', 'no-store');
    createReadStream(file).pipe(response);
  } catch {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.end('Not found');
  }
}).listen(port, host, () => {
  console.log(`Preview: http://localhost:${port}/quiz.html`);
});

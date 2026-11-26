// Tạo ảnh xem trước cho từng mô hình đã chuẩn hoá (CV1.6).
// Node không vẽ được WebGL, nên script mở một máy chủ nhỏ; trang preview-page.html vẽ bằng
// three.js trong trình duyệt rồi gửi ảnh PNG về, script lưu vào assets/models/previews/<id>.png.
// Cách dùng: node render-previews.js [id ...]  → mở đường dẫn in ra bằng trình duyệt.
// Không truyền id thì vẽ lại toàn bộ thư viện. Máy chủ tự tắt khi vẽ xong.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const MODELS = path.join(ROOT, 'assets/models');
const PREVIEWS = path.join(MODELS, 'previews');
const THREE = path.join(import.meta.dirname, 'node_modules/three');
const PAGE = path.join(import.meta.dirname, 'preview-page.html');
const PORT = 8766;

const catalog = JSON.parse(fs.readFileSync(path.join(MODELS, 'catalog.json'), 'utf8'));
const only = process.argv.slice(2);
const unknown = only.filter((id) => !catalog.some((item) => item.id === id));
if (unknown.length) throw new Error(`Không có trong catalog: ${unknown.join(', ')}`);
const ids = catalog.map((item) => item.id).filter((id) => !only.length || only.includes(id));
fs.mkdirSync(PREVIEWS, { recursive: true });

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary' };

// Chỉ trả tệp nằm trong thư mục cho phép
function sendFile(res, base, rel) {
  const file = path.resolve(base, rel);
  if (!file.startsWith(base + path.sep) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}

let saved = 0;
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);

  if (req.method === 'POST' && url.startsWith('/previews/')) {
    const id = path.basename(url, '.png');
    if (!ids.includes(id)) { res.writeHead(400); return res.end(); }
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const png = Buffer.concat(chunks);
      fs.writeFileSync(path.join(PREVIEWS, `${id}.png`), png);
      console.log(`${String(++saved).padStart(3)}/${ids.length} ${id.padEnd(16)} ${(png.length / 1024).toFixed(0)} KB`);
      res.end('ok');
      if (saved === ids.length) { console.log(`Xong: ${PREVIEWS}`); server.close(); process.exit(0); }
    });
    return;
  }

  if (url === '/') return sendFile(res, path.dirname(PAGE), path.basename(PAGE));
  if (url === '/ids.json') { res.writeHead(200, { 'Content-Type': TYPES['.json'] }); return res.end(JSON.stringify(ids)); }
  if (url.startsWith('/models/')) return sendFile(res, path.join(MODELS, 'processed'), url.slice('/models/'.length));
  if (url.startsWith('/three/')) return sendFile(res, THREE, url.slice('/three/'.length));
  res.writeHead(404);
  res.end();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Mở trình duyệt tại http://127.0.0.1:${PORT}/ để vẽ ${ids.length} ảnh xem trước…`);
});

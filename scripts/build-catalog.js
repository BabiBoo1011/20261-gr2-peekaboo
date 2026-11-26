// Sinh assets/models/catalog.json từ bảng danh sách vật trong docs/07-danh-sach-vat.md.
// Tên, chủ đề lấy từ docs/07; nguồn và giấy phép (BR06) lấy từ gói tải về.
// Vật đã có trong catalog được giữ nguyên các giá trị đã điền (size, sizeAxis, rotate, tagsEn, tagsVi...).
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOC = path.join(ROOT, 'docs/07-danh-sach-vat.md');
const CATALOG = path.join(ROOT, 'assets/models/catalog.json');
const RAW = path.join(ROOT, 'assets/models/raw');

// Viết tắt nguồn Kenney → thư mục chứa tệp .glb (xem phần Quy ước của docs/07)
const KENNEY = {
  'kn-furniture-kit': 'kenney_furniture-kit/Models/GLTF format',
  'kn-cube-pets': 'kenney_cube-pets_1.0/Models/GLB format',
  'kn-food-kit': 'kenney_food-kit/Models/GLB format',
  'kn-toy-car-kit': 'kenney_toy-car-kit/Models/GLB format',
};

// "kn-furniture-kit / table" → "kenney_furniture-kit/Models/GLTF format/table.glb"
function toSource(text) {
  const [prefix, file] = text.split(' / ').map((s) => s.trim());
  const dir = prefix.startsWith('pp-') ? `polypizza_${prefix.slice(3)}` : KENNEY[prefix];
  if (!dir) throw new Error(`Không hiểu viết tắt nguồn "${prefix}"`);
  return `${dir}/${file}.glb`;
}

// Đọc catalog cũ (nếu có) để giữ lại các giá trị đã điền
const old = fs.existsSync(CATALOG) ? JSON.parse(fs.readFileSync(CATALOG, 'utf8')) : [];
const oldById = new Map(old.map((item) => [item.id, item]));

// Đọc các bảng trong docs/07, kèm chủ đề lấy từ tiêu đề mục, ví dụ "## 1. Lớp học (Classroom) – 16 vật"
// Cột: | STT | id | Từ vựng (EN) | Nghĩa (VI) | Tệp nguồn | Vai trò | Ghi chú |
const rows = [];
let topic = '';
for (const line of fs.readFileSync(DOC, 'utf8').split(/\r?\n/)) {
  const heading = line.match(/^## \d+\. .*\((\w+)\)/);
  if (heading) topic = heading[1].toLowerCase();
  if (/^\| \d+ \| /.test(line)) rows.push({ topic, cells: line.split('|').map((cell) => cell.trim()) });
}

// Các gói Kenney đều là CC0; mô hình Poly Pizza đọc dòng đầu của license.txt.
// Thư mục raw/ không có trên Git, nên khi thiếu tệp thì giữ thông tin đã ghi trong catalog.
function toCredit(source, prevCredit) {
  const folder = source.split('/')[0];
  if (folder.startsWith('kenney_')) return { author: 'Kenney', license: 'CC0', url: 'https://kenney.nl/assets' };

  const file = path.join(RAW, folder, 'license.txt');
  if (!fs.existsSync(file)) return prevCredit ?? {};
  const text = fs.readFileSync(file, 'utf8').split(/\r?\n/)[0].trim();
  const version = text.match(/licenses\/by\/([\d.]+)/)?.[1];
  const license = text.match(/\[(CC0|CC-BY)\]/)?.[1];
  return {
    author: text.match(/ by (.+) \[/)?.[1],
    license: version ? `${license} ${version}` : license,
    url: text.match(/https:\/\/poly\.pizza\/m\/[\w-]+/)?.[0],
    attribution: text,
  };
}

const catalog = rows.map(({ topic, cells }) => {
  const id = cells[2];
  const source = toSource(cells[5]);
  if (!fs.existsSync(path.join(RAW, source))) console.warn(`⚠ ${id}: không thấy tệp ${source}`);

  const prev = oldById.get(id) ?? { size: null, sizeAxis: 'height', rotate: [0, 0, 0] };
  // Trường lấy từ docs/07 và nguồn luôn đứng trước, phần còn lại (số đo...) giữ nguyên thứ tự
  const info = {
    id,
    nameEn: cells[3],
    nameVi: cells[4],
    topic,
    tagsEn: prev.tagsEn ?? [],
    tagsVi: prev.tagsVi ?? [],
    source,
    credit: toCredit(source, prev.credit),
  };
  return { ...info, ...prev, ...info };
});

fs.writeFileSync(CATALOG, JSON.stringify(catalog, null, 2) + '\n');

// Báo các vật còn thiếu thông tin bắt buộc
const missing = (test) => catalog.filter(test).map((item) => item.id).join(', ') || 'không';
console.log(`Đã ghi ${catalog.length} vật vào catalog.json.`);
console.log('Thiếu thẻ tiếng Anh :', missing((i) => i.tagsEn.length === 0));
console.log('Thiếu thẻ tiếng Việt:', missing((i) => i.tagsVi.length === 0));
console.log('Thiếu giấy phép     :', missing((i) => !i.credit.license || !i.credit.author || !i.credit.url));

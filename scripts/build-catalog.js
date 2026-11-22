// Sinh assets/models/catalog.json từ bảng danh sách vật trong docs/07-danh-sach-vat.md.
// Vật đã có trong catalog được giữ nguyên các giá trị đã điền (size, sizeAxis, rotate...).
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

// Lấy các dòng dữ liệu trong bảng: dòng bắt đầu bằng "| <số> |"
// Cột: | STT | id | Từ vựng (EN) | Nghĩa (VI) | Tệp nguồn | Vai trò | Ghi chú |
const rows = fs.readFileSync(DOC, 'utf8')
  .split('\n')
  .filter((line) => /^\| \d+ \| /.test(line))
  .map((line) => line.split('|').map((cell) => cell.trim()));

let kept = 0;
const catalog = rows.map((cells) => {
  const id = cells[2];
  const source = toSource(cells[5]);
  if (!fs.existsSync(path.join(RAW, source))) console.warn(`⚠ ${id}: không thấy tệp ${source}`);

  const prev = oldById.get(id);
  if (prev) {
    kept++;
    return { ...prev, source };
  }
  return { id, source, size: null, sizeAxis: 'height', rotate: [0, 0, 0] };
});

fs.writeFileSync(CATALOG, JSON.stringify(catalog, null, 2) + '\n');
console.log(`Đã ghi ${catalog.length} vật vào catalog.json.`);
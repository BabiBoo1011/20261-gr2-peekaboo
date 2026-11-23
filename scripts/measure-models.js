// Đo thuộc tính phục vụ sắp xếp cảnh cho mô hình đã chuẩn hoá (CV1.4).
// - bbox: kích thước hộp bao [rộng, cao, sâu] (mét), cho mọi vật.
// - surface: mặt đặt đồ (vai trò "đỡ") – bắn tia từ trên xuống.
// - under: khoảng trống dưới gầm (vai trò "gầm") – bắn tia từ sàn lên.
// - container: lòng chứa (vai trò "chứa") – so độ cao đáy lòng với miệng.
// Vai trò của từng vật lấy từ cột "Vai trò" trong docs/07-danh-sach-vat.md.
// Trường "manual" trong catalog.json liệt kê các thuộc tính nhập tay (ví dụ ["container"]):
// những thuộc tính này được giữ nguyên, không đo lại.
import fs from 'node:fs';
import path from 'node:path';
import { NodeIO, getBounds } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';

const ROOT = path.resolve(import.meta.dirname, '..');
const MODELS = path.join(ROOT, 'assets/models');
const CATALOG = path.join(MODELS, 'catalog.json');
const DOC = path.join(ROOT, 'docs/07-danh-sach-vat.md');

const GRID = 31;          // số điểm bắn tia mỗi chiều
const BIN = 0.01;         // gom độ cao theo bậc 1 cm
const round = (v) => Math.round(v * 1000) / 1000;

// Vai trò từ docs/07: cột | STT | id | EN | VI | Tệp nguồn | Vai trò | Ghi chú |
const roles = new Map(
  fs.readFileSync(DOC, 'utf8').split('\n')
    .filter((l) => /^\| \d+ \| /.test(l))
    .map((l) => l.split('|').map((c) => c.trim()))
    .map((c) => [c[2], c[6]]),
);

// Lấy toàn bộ tam giác của mô hình trong toạ độ thế giới
function worldTriangles(doc) {
  const tris = [];
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const m = node.getWorldMatrix();
    const tf = (v) => [
      m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12],
      m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13],
      m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14],
    ];
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION');
      if (!pos) continue;
      const idx = prim.getIndices();
      const count = idx ? idx.getCount() : pos.getCount();
      const get = (i) => tf(pos.getElement(idx ? idx.getScalar(i) : i, []));
      for (let i = 0; i + 2 < count; i += 3) tris.push([get(i), get(i + 1), get(i + 2)]);
    }
  }
  return tris;
}

// Tia thẳng đứng tại (x, z): trả về mọi độ cao y mà tia cắt tam giác
function verticalHits(tris, x, z) {
  const hits = [];
  for (const [a, b, c] of tris) {
    const d = (b[2] - c[2]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[2] - c[2]);
    if (Math.abs(d) < 1e-12) continue; // tam giác đứng thẳng, tia không cắt mặt
    const w1 = ((b[2] - c[2]) * (x - c[0]) + (c[0] - b[0]) * (z - c[2])) / d;
    const w2 = ((c[2] - a[2]) * (x - c[0]) + (a[0] - c[0]) * (z - c[2])) / d;
    const w3 = 1 - w1 - w2;
    if (w1 < -1e-9 || w2 < -1e-9 || w3 < -1e-9) continue;
    hits.push(w1 * a[1] + w2 * b[1] + w3 * c[1]);
  }
  return hits;
}

// Lưới điểm trong vùng giữa của hộp bao (frac = tỉ lệ vùng giữa)
function grid(b, frac) {
  const pts = [];
  const cx = (b.min[0] + b.max[0]) / 2, cz = (b.min[2] + b.max[2]) / 2;
  const hx = ((b.max[0] - b.min[0]) * frac) / 2, hz = ((b.max[2] - b.min[2]) * frac) / 2;
  for (let i = 0; i < GRID; i++) for (let j = 0; j < GRID; j++) {
    pts.push([cx - hx + (2 * hx * i) / (GRID - 1), cz - hz + (2 * hz * j) / (GRID - 1)]);
  }
  return pts;
}

// Độ cao gặp nhiều nhất (theo bậc 1 cm); hoà thì lấy bậc cao hơn
function mode(values) {
  const count = new Map();
  for (const v of values) { const k = Math.round(v / BIN); count.set(k, (count.get(k) || 0) + 1); }
  let best = null, bestN = 0;
  for (const [k, n] of count) if (n > bestN || (n === bestN && k > best)) { best = k; bestN = n; }
  return { y: best * BIN, share: bestN / values.length };
}

// Kích thước vùng (rộng theo x, sâu theo z) của các điểm thoả điều kiện
function extent(points) {
  if (!points.length) return [0, 0];
  const xs = points.map((p) => p[0]), zs = points.map((p) => p[1]);
  return [round(Math.max(...xs) - Math.min(...xs)), round(Math.max(...zs) - Math.min(...zs))];
}

function measureSurface(tris, b) {
  const samples = grid(b, 0.9).map(([x, z]) => {
    const h = verticalHits(tris, x, z);
    return h.length ? [x, z, Math.max(...h)] : null; // tia từ trên xuống: điểm chạm cao nhất
  }).filter(Boolean);
  if (samples.length < GRID) return null;
  const m = mode(samples.map((s) => s[2]));
  const on = samples.filter((s) => Math.abs(s[2] - m.y) <= BIN * 1.5);
  return { y: round(m.y), size: extent(on), share: round(on.length / samples.length) };
}

function measureUnder(tris, b) {
  const samples = grid(b, 0.7).map(([x, z]) => {
    const h = verticalHits(tris, x, z).filter((y) => y > 0.005);
    const blockedAtFloor = verticalHits(tris, x, z).some((y) => y <= 0.005);
    return [x, z, blockedAtFloor || !h.length ? 0 : Math.min(...h)]; // tia từ sàn lên: điểm chạm thấp nhất
  });
  const open = samples.filter((s) => s[2] > 0.03);
  if (open.length < samples.length * 0.4) return null; // phần lớn bị chắn → không có gầm
  // Độ cao gặp nhiều nhất = mặt dưới của mặt bàn / mặt ghế; bỏ qua các thanh ngang nối chân (diện tích nhỏ)
  const m = mode(open.map((s) => s[2]));
  return { height: round(m.y), size: extent(open.filter((s) => s[2] >= m.y - BIN * 1.5)), share: round(open.length / samples.length) };
}

function measureContainer(tris, b) {
  const rimY = b.max[1];
  const inner = grid(b, 0.5).map(([x, z]) => {
    const h = verticalHits(tris, x, z);
    return h.length ? [x, z, Math.max(...h)] : null;
  }).filter(Boolean);
  if (inner.length < GRID) return null;
  const floor = mode(inner.map((s) => s[2]));
  const height = b.max[1] - b.min[1];
  if (rimY - floor.y < Math.max(0.01, height * 0.3)) return null; // lòng quá nông → không chứa được
  const inside = grid(b, 0.95).map(([x, z]) => {
    const h = verticalHits(tris, x, z);
    return h.length ? [x, z, Math.max(...h)] : null;
  }).filter((s) => s && s[2] < rimY - (rimY - floor.y) * 0.5);
  return { floorY: round(floor.y), rimY: round(rimY), size: extent(inside) };
}

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
const report = [];

for (const item of catalog) {
  const manual = new Set(item.manual ?? []);
  const file = path.join(MODELS, 'processed', `${item.id}.glb`);
  if (!fs.existsSync(file)) { report.push(`${item.id.padEnd(16)} bỏ qua: chưa có tệp đã chuẩn hoá`); continue; }

  const doc = await io.read(file);
  const scene = doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0];
  const b = getBounds(scene);
  item.bbox = [0, 1, 2].map((i) => round(b.max[i] - b.min[i]));
  for (const f of ['surface', 'under', 'container']) if (!manual.has(f)) delete item[f];
  delete item.measureNote;

  const role = roles.get(item.id) ?? '';
  const notes = [];
  if (/đỡ|gầm|chứa/.test(role)) {
    const tris = worldTriangles(doc);
    if (role.includes('đỡ') && !manual.has('surface')) {
      const s = measureSurface(tris, b);
      if (s) item.surface = { y: s.y, size: s.size }; else notes.push('không đo được mặt đỡ');
    }
    if (role.includes('gầm') && !manual.has('under')) {
      const u = measureUnder(tris, b);
      if (u) item.under = { height: u.height, size: u.size }; else notes.push('không thấy khoảng trống dưới gầm');
    }
    if (role.includes('chứa') && !manual.has('container')) {
      const c = measureContainer(tris, b);
      if (c) item.container = c; else notes.push('không thấy lòng chứa');
    }
  }
  if (manual.size) notes.push(`nhập tay: ${[...manual].join(', ')}`);
  if (notes.length) item.measureNote = notes.join('; ');

  const parts = [`bbox ${item.bbox.join(' × ')}`];
  if (item.surface) parts.push(`mặt đỡ y=${item.surface.y} (${item.surface.size.join('×')})`);
  if (item.under) parts.push(`gầm cao ${item.under.height} (${item.under.size.join('×')})`);
  if (item.container) parts.push(`lòng đáy=${item.container.floorY} miệng=${item.container.rimY} (${item.container.size.join('×')})`);
  if (notes.length) parts.push(`⚠ ${notes.join('; ')}`);
  report.push(`${item.id.padEnd(16)} [${role || '-'}] ${parts.join(' | ')}`);
}

fs.writeFileSync(CATALOG, JSON.stringify(catalog, null, 2) + '\n');
console.log(report.join('\n'));

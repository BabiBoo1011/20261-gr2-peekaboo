// Chuẩn hoá mô hình 3D: gốc toạ độ ở tâm đáy, đúng hướng, đúng kích thước thực, nhúng texture.
import fs from 'node:fs';
import path from 'node:path';
import { NodeIO, getBounds } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, dedup } from '@gltf-transform/functions';

const ROOT = path.resolve(import.meta.dirname, '../assets/models');
const RAW = path.join(ROOT, 'raw');
const OUT = path.join(ROOT, 'processed');
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'catalog.json'), 'utf8'));

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
fs.mkdirSync(OUT, { recursive: true });

// Đổi góc Euler (độ, thứ tự X → Y → Z) sang quaternion
function eulerToQuat([x, y, z]) {
  const r = Math.PI / 360; // độ → nửa góc radian
  const [cx, sx] = [Math.cos(x * r), Math.sin(x * r)];
  const [cy, sy] = [Math.cos(y * r), Math.sin(y * r)];
  const [cz, sz] = [Math.cos(z * r), Math.sin(z * r)];
  return [
    sx * cy * cz + cx * sy * sz,
    cx * sy * cz - sx * cy * sz,
    cx * cy * sz + sx * sy * cz,
    cx * cy * cz - sx * sy * sz,
  ];
}

for (const item of catalog) {
  // Bỏ qua vật chưa điền kích thước (tránh tạo tệp có tỉ lệ 0)
  if (!(item.size > 0)) {
    console.log(`${item.id.padEnd(16)} bỏ qua: chưa điền size`);
    continue;
  }

  const doc = await io.read(path.join(RAW, item.source));
  const scene = doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0];

  // 1. Gom mọi nút gốc vào một nút bọc ngoài
  const wrapper = doc.createNode(item.id);
  for (const child of scene.listChildren()) {
    scene.removeChild(child);
    wrapper.addChild(child);
  }
  scene.addChild(wrapper);

  // 2. Xoay
  wrapper.setRotation(eulerToQuat(item.rotate ?? [0, 0, 0]));

  // 3. Tính tỉ lệ
  let b = getBounds(scene);
  const dim = [0, 1, 2].map((i) => b.max[i] - b.min[i]);
  const measured = item.sizeAxis === 'longest' ? Math.max(...dim) : dim[1];
  const s = item.size / measured;
  wrapper.setScale([s, s, s]);

  // 4. Dời tâm đáy về gốc toạ độ
  b = getBounds(scene);
  wrapper.setTranslation([
    -(b.min[0] + b.max[0]) / 2,
    -b.min[1],
    -(b.min[2] + b.max[2]) / 2,
  ]);

  // 5. Dọn dữ liệu thừa và ghi ra (texture ngoài được nhúng vào tệp .glb)
  await doc.transform(prune(), dedup());
  const out = path.join(OUT, `${item.id}.glb`);
  await io.write(out, doc);

  // 6. In kết quả để kiểm tra
  b = getBounds(scene);
  const size = [0, 1, 2].map((i) => (b.max[i] - b.min[i]).toFixed(2)).join(' × ');
  const kb = (fs.statSync(out).size / 1024).toFixed(0);
  console.log(`${item.id.padEnd(16)} ${size} m | đáy y=${b.min[1].toFixed(3)} | ${kb} KB`);
}
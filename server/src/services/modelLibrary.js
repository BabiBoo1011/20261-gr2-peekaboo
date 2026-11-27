// Thư viện mô hình 3D. Tạm thời đọc từ assets/models/catalog.json;
// khi có CSDL (CV2.3) sẽ chuyển sang đọc từ bảng mô hình.
import fs from 'node:fs/promises';
import path from 'node:path';
import { MODELS_DIR } from '../config.js';

export async function listModels() {
  const catalog = JSON.parse(await fs.readFile(path.join(MODELS_DIR, 'catalog.json'), 'utf8'));
  return catalog.map((item) => ({
    id: item.id,
    nameEn: item.nameEn,
    nameVi: item.nameVi,
    topic: item.topic,
    tagsEn: item.tagsEn,
    tagsVi: item.tagsVi,
    bbox: item.bbox,
    credit: item.credit,
    file: `/models/${item.id}.glb`,
    preview: `/previews/${item.id}.png`,
  }));
}

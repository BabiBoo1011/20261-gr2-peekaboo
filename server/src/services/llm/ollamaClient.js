// Gọi Ollama qua HTTP API. Giai đoạn 3 sẽ thêm hàm sinh dàn ý (gửi kèm JSON Schema).
import { OLLAMA_URL } from '../../config.js';

async function request(pathname) {
  const res = await fetch(OLLAMA_URL + pathname, { signal: AbortSignal.timeout(3000) });
  if (!res.ok) throw new Error(`Ollama trả lỗi ${res.status}`);
  return res.json();
}

// Kiểm tra Ollama đang chạy: trả về phiên bản và tên các mô hình đã tải
export async function checkOllama() {
  const [{ version }, { models }] = await Promise.all([request('/api/version'), request('/api/tags')]);
  return { version, models: models.map((m) => m.name) };
}

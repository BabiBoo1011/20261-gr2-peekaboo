// Cấu hình đọc từ biến môi trường (tệp server/.env, xem .env.example)
import 'dotenv/config';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');

export const PORT = Number(process.env.PORT ?? 3001);
export const DATABASE_URL = process.env.DATABASE_URL;
export const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://127.0.0.1:11434';

// Thư viện mô hình 3D dùng chung với scripts/ (giai đoạn 1)
export const MODELS_DIR = path.join(ROOT, 'assets/models');

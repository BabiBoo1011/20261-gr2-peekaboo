import { checkDatabase } from '../db/pool.js';
import { checkOllama } from '../services/llm/ollamaClient.js';

// Kiểm tra từng dịch vụ; một dịch vụ lỗi không làm hỏng cả phản hồi
async function probe(check) {
  try {
    return { ok: true, ...(await check()) };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function getHealth(req, res) {
  const [database, ollama] = await Promise.all([probe(checkDatabase), probe(checkOllama)]);
  res.json({ server: { ok: true }, database, ollama });
}

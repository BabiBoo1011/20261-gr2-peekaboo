// Thử một lần: gửi outline.schema.json cho Ollama, kiểm tra dàn ý trả về có hợp lệ không (CV2.2).
// Chạy: node tests/try-outline-schema.js [tên mô hình]   (mặc định qwen2.5:7b)
import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';

const model = process.argv[2] ?? 'qwen2.5:7b';
const schema = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../../shared/schemas/outline.schema.json'), 'utf8'));

const system = `You design English lessons for Vietnamese primary school students (beginner level).
Each slide teaches ONE preposition with ONE short sentence, e.g. "The cat is under the table."
"objects" are short lowercase English nouns. Use "object2" only with "between". Reply ONLY with JSON.`;
const prompt = 'Bài học về giới từ on, under, between cho học sinh lớp 3, dùng đồ vật trong lớp học, 3 slide.';

const started = Date.now();
const res = await fetch('http://127.0.0.1:11434/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model,
    stream: false,
    format: schema,
    options: { temperature: 0.2 },
    messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }],
  }),
});
if (!res.ok) throw new Error(`Ollama trả lỗi ${res.status}: ${await res.text()}`);
const outline = JSON.parse((await res.json()).message.content);

const validate = new Ajv({ allErrors: true }).compile(schema);
console.log(JSON.stringify(outline, null, 2));
console.log(`\nMô hình: ${model} | thời gian: ${((Date.now() - started) / 1000).toFixed(1)} s`);
console.log(validate(outline) ? 'Hợp lệ theo outline.schema.json' : `KHÔNG hợp lệ: ${new Ajv().errorsText(validate.errors)}`);
import path from 'node:path';
import express from 'express';
import { MODELS_DIR, PORT } from './config.js';
import { apiRouter } from './routes/index.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();
app.disable('x-powered-by');
app.use(express.json());

app.use('/api', apiRouter);
// Tệp mô hình đã chuẩn hoá và ảnh xem trước
app.use('/models', express.static(path.join(MODELS_DIR, 'processed'), { maxAge: '1h' }));
app.use('/previews', express.static(path.join(MODELS_DIR, 'previews'), { maxAge: '1h' }));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server Peekaboo chạy tại http://localhost:${PORT}`));

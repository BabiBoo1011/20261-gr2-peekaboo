// Khai báo các API, tất cả bắt đầu bằng /api
import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import { getModels } from '../controllers/modelController.js';

export const apiRouter = Router();

apiRouter.get('/health', getHealth);
apiRouter.get('/models', getModels);

import { listModels } from '../services/modelLibrary.js';

export async function getModels(req, res) {
  res.json(await listModels());
}

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const readFileMiddleware = async (req, res, next) => {
  try {
    const fileName = req.path.split('/')[1];
    const filePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      `../../data/${fileName}.json`
    );

    if (!fileName) return res.status(400).send('Invalid route');

    const data = await fs.readFile(filePath, 'utf-8');

    req.data = data.length > 0 ? JSON.parse(data) : [];
    next();
  } catch (error) {
    throw error;
  }
};

export default readFileMiddleware;

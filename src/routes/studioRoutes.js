import { Router } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import writeFileMiddleware from '../middlewares/writeFileMiddleware.js';

const studioRouter = Router();
const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const studiosFile = path.join(dirName, '../../data/studios.json');

studioRouter.post(
  '',
  async (req, res, next) => {
    const studios = req.data;
    const newStudio = {
      id: studios.length > 0 ? studios[studios.length - 1].id + 1 : 1,
      name: req.body.name,
    };
    studios.push(newStudio);
    res.file = studiosFile;
    res.data = studios;
    res.newRegister = newStudio;
    next();
  },
  writeFileMiddleware
);

studioRouter.get('', async (req, res) => {
  const studios = req.data;
  res.send({ studios });
});

studioRouter.get('/:id', async (req, res) => {
  const studios = req.data;
  const studio = studios.find((s) => s.id == req.params.id);
  res.send(studio);
});

studioRouter.put(
  '/:id',
  async (req, res, next) => {
    const studios = req.data;
    const index = studios.findIndex((s) => s.id == req.params.id);
    if (index < 0)
      return res.status(404).send(`Studio of id ${req.params.id} not found`);

    const updateStudio = {
      ...studios[index],
      name: req.body.name,
    };
    studios[index] = updateStudio;

    res.file = studiosFile;
    res.data = studios;
    res.updated = updateStudio;
    next();
  },
  writeFileMiddleware
);

studioRouter.delete(
  '/:id',
  async (req, res, next) => {
    const studios = req.data;
    const index = studios.findIndex((s) => s.id == req.params.id);
    if (index < 0)
      return res.status(404).send(`Studio of id ${req.params.id} not found`);

    studios.splice(index, 1);

    res.file = studiosFile;
    res.data = studios;
    next();
  },
  writeFileMiddleware
);

export default studioRouter;

import { Router } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import writeFileMiddleware from '../middlewares/writeFileMiddleware.js';

const directorRouter = Router();
const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const filePath = path.join(dirName, '../../data/directors.json');

directorRouter.post(
  '',
  async (req, res, next) => {
    const directors = req.data;
    const newDirector = {
      id: directors.length > 0 ? directors[directors.length - 1].id + 1 : 1,
      name: req.body.name,
    };
    directors.push(newDirector);

    res.file = filePath;
    res.data = directors;
    res.newRegister = newDirector;
    next();
  },
  writeFileMiddleware
);

directorRouter.get('', async (req, res) => {
  const directors = req.data;
  res.send({ directors });
});

directorRouter.get('/:id', async (req, res) => {
  const directors = req.data;
  const director = directors.find((d) => d.id == req.params.id);
  res.send(director);
});

directorRouter.put(
  '/:id',
  async (req, res, next) => {
    const directors = req.data;
    const index = directors.findIndex((d) => d.id == req.params.id);
    if (index < 0)
      return res.status(404).send(`Director of id ${req.params.id} not found`);

    const updateDirector = {
      ...directors[index],
      name: req.body.name,
    };
    directors[index] = updateDirector;

    res.file = filePath;
    res.data = directors;
    res.updated = updateDirector;
    next();
  },
  writeFileMiddleware
);

directorRouter.delete(
  '/:id',
  async (req, res, next) => {
    const directors = req.data;
    const index = directors.findIndex((d) => d.id == req.params.id);
    if (index < 0)
      return res.status(404).send(`Director of id ${req.params.id} not found`);

    directors.splice(index, 1);

    res.file = filePath;
    res.data = directors;
    next();
  },
  writeFileMiddleware
);

export default directorRouter;

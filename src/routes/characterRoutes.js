import { Router } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import writeFileMiddleware from '../middlewares/writeFileMiddleware.js';

const characterRouter = Router();
const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const filePath = path.join(dirName, '../../data/characters.json');

characterRouter.post(
  '',
  async (req, res, next) => {
    const characters = req.data;
    const newCharacter = {
      id: characters.length > 0 ? characters[characters.length - 1].id + 1 : 1,
      name: req.body.name,
    };
    characters.push(newCharacter);

    res.file = filePath;
    res.data = characters;
    res.newRegister = newCharacter;
    next();
  },
  writeFileMiddleware
);

characterRouter.get('', async (req, res) => {
  const characters = req.data;
  res.send({ directors: characters });
});

characterRouter.get('/:id', async (req, res) => {
  const characters = req.data;
  const character = characters.find((c) => c.id == req.params.id);
  res.send(character);
});

characterRouter.put(
  '/:id',
  async (req, res, next) => {
    const characters = req.data;
    const index = characters.findIndex((c) => c.id == req.params.id);
    if (index < 0)
      return res.status(404).send(`Character of id ${req.params.id} not found`);

    const updateCharacter = {
      ...characters[index],
      name: req.body.name,
    };
    characters[index] = updateCharacter;

    res.file = filePath;
    res.data = characters;
    res.updated = updateCharacter;
    next();
  },
  writeFileMiddleware
);

characterRouter.delete(
  '/:id',
  async (req, res, next) => {
    const characters = req.data;
    const index = characters.findIndex((c) => c.id == req.params.id);
    if (index < 0)
      return res.status(404).send(`Character of id ${req.params.id} not found`);

    characters.splice(index, 1);

    res.file = filePath;
    res.data = characters;
    next();
  },
  writeFileMiddleware
);

export default characterRouter;

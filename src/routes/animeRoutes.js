import { Router } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import writeFileMiddleware from '../middlewares/writeFileMiddleware.js';

const animeRouter = Router();
const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const animesFile = path.join(dirName, '../../data/animes.json');

animeRouter.post(
  '',
  async (req, res, next) => {
    const animes = req.data;

    const newAnime = {
      id: animes.length > 0 ? animes[animes.length - 1].id + 1 : 1,
      title: req.body.title,
      genre: req.body.genre,
      studioId: req.body.studioId,
    };

    animes.push(newAnime);

    res.file = animesFile;
    res.data = animes;
    res.newRegister = newAnime;
    next();
  },
  writeFileMiddleware
);

animeRouter.get('', async (req, res) => {
  const animes = req.data;
  res.send({ animes });
});

animeRouter.get('/:id', async (req, res) => {
  const animes = req.data;
  const anime = animes.find((a) => a.id == req.params.id);
  res.send({ anime });
});

animeRouter.put(
  '/:id',
  async (req, res, next) => {
    const animes = req.data;
    const index = animes.findIndex((a) => a.id == req.params.id);
    if (index < 0)
      return res.status(404).send(`Anime of id ${req.params.id} not found`);

    const updateAnime = {
      ...animes[index],
      title: req.body.title,
      genre: req.body.genre,
    };

    animes[index] = updateAnime;

    res.file = animesFile;
    res.data = animes;
    res.updated = updateAnime;

    next();
  },
  writeFileMiddleware
);

animeRouter.delete(
  '/:id',
  async (req, res, next) => {
    const animes = req.data;
    const index = animes.findIndex((a) => a.id == req.params.id);
    if (index < 0)
      return res.status(404).send(`Anime of id ${req.params.id} not found`);
    animes.splice(index, 1);

    res.file = animesFile;
    res.data = animes;
    next();
  },
  writeFileMiddleware
);

export default animeRouter;

import express from 'express';
import dotenv from 'dotenv';
import animeRouter from './src/routes/animeRoutes.js';
import studioRouter from './src/routes/studioRoutes.js';
import directorRouter from './src/routes/directorRoutes.js';
import characterRouter from './src/routes/characterRoutes.js';
import readFileMiddleware from './src/middlewares/readFileMiddleware.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(readFileMiddleware);
app.use('/animes', animeRouter);
app.use('/studios', studioRouter);
app.use('/directors', directorRouter);
app.use('/characters', characterRouter);

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});

export default app;

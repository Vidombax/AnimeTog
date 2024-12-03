import Router from 'express';
import AnimeHandler from '../handlers/animejoy/handler.js';

const router = new Router();

router.get('/anime', AnimeHandler.getAnime);

export default router;
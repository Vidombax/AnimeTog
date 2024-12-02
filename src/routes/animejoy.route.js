import Router from 'express';
import { getAnime } from "../handlers/animejoy/handler";

const router = new Router();

router.get('/anime', getAnime);

export default router;
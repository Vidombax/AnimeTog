import Router from 'express';
import MainHandler from '../handlers/main/handler.js';

const router = new Router();

router.get('/account/:email/:password', MainHandler.Authorization);
router.get('/account/:id', MainHandler.getUser);

export default router;

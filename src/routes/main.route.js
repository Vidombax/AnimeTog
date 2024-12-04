import Router from 'express';
import MainHandler from '../handlers/main/handler.js';

const router = new Router();

router.get('/account/:email/:password', MainHandler.Authorization);

export default router;
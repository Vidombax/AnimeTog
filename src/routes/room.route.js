import Router from 'express';
import RoomHandler from '../handlers/room/handler.js';

const router = new Router();

router.post('/room', RoomHandler.createRoom);
router.get('/room/:uuid', RoomHandler.getRoom);

export default router;
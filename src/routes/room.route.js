import Router from 'express';
import RoomHandler from '../handlers/room/handler.js';

const router = new Router();

router.post('/room', RoomHandler.createRoom);
router.get('/room/:uuid', RoomHandler.getRoom);
router.put('/room', RoomHandler.addIFrameToDB);
router.get('/iframe/:uuid', RoomHandler.getIFrame);
router.put('/room-visible', RoomHandler.setVisibleRoom);

export default router;

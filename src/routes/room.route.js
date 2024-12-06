import Router from 'express';
import RoomHandler from '../handlers/room/handler.js';

const router = new Router();

router.post('/room', RoomHandler.createRoom);
router.get('/room/:uuid', RoomHandler.getRoom);
router.put('/room', RoomHandler.addIFrameToDB);
router.put('/room-visible', RoomHandler.setVisibleRoom);
router.get('/info-room/:uuid', RoomHandler.getAllInfoRoom);
router.get('/access-to-room/:id/:uuid', RoomHandler.checkAccessToRoom);

export default router;

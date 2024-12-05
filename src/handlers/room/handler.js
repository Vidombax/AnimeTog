import db from '../../db.js';
import { v4 as uuidv4 } from 'uuid';

class RoomHandler {
    async createRoom(req, res) {
        try {
            const id = req.body.id;
            const uuidRoom = uuidv4();
            const room = await db.query('INSERT INTO rooms (id_user, date_create, uuid_room, is_private) VALUES ($1, CURRENT_DATE, $2, false) RETURNING *', [id, uuidRoom]);
            if (room.rows.length > 0) {
                res.json(room.rows[0]);
            }
            else {
                res.status(400).json({ error: 'Не удалось создать комнату' });
            }
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
    async getRoom(req, res) {
        try {
            const uuid = req.params.uuid;
            const room = await db.query('SELECT * FROM rooms WHERE uuid_room = $1', [uuid]);
            if (room.rows.length > 0) {
                res.json({ answer: 'true' });
            } else {
                res.status(403).json({ answer: 'Такой комнаты не существует' });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
    async addIFrameToDB(req, res) {
        try {
            const uuid = req.body.uuid;
            const iframe = req.body.iframe;
            const room = await db.query(
                'UPDATE rooms SET iframe = $1 WHERE uuid_room = $2 RETURNING *',
                [iframe, uuid]
            );
            if (room.rows.length > 0) {
                res.json({ answer: 'true' });
            }
            else {
                res.status(401).json({ answer: 'Не получилось сохранить данные плеера' });
            }
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
    async getIFrame(req, res) {
        try {
            const uuid = req.params.uuid;
            const iframe = await db.query(
              'SELECT * FROM rooms WHERE uuid_room = $1',
              [uuid]
            );
            if (iframe.rows.length > 0) {
                res.json(iframe.rows[0]);
            }
            else {
                console.log(`У комнаты ${uuid} нету плеера`);
            }
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
    async setVisibleRoom(req, res){
        try {
            const uuid = req.body.uuid;
            const getPrivate = await db.query(
              'SELECT * from rooms WHERE uuid_room = $1',
              [uuid]
            );
            const visibleStatus = getPrivate.rows[0].is_private;
            console.log(visibleStatus)
            if (visibleStatus === true) {
                const visible = await db.query(
                    'UPDATE rooms SET is_private = $1 WHERE uuid_room = $2 RETURNING *',
                    [false, uuid]
                );
                if (visible.rows.length > 0) {
                    res.json(false);
                }
            }
            else {
                const visible = await db.query(
                    'UPDATE rooms SET is_private = $1 WHERE uuid_room = $2 RETURNING *',
                    [true, uuid]
                );
                if (visible.rows.length > 0) {
                    res.json(true);
                }
            }
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
}

export default new RoomHandler();

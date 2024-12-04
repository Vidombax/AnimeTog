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

}

export default new RoomHandler();
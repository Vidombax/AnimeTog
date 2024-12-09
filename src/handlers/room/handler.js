import db from '../../db.js';
import { v4 as uuidv4 } from 'uuid';

class RoomHandler {
    async createRoom(req, res) {
        try {
            const id = req.body.id;
            const uuidRoom = uuidv4();
            const room = await db.query('INSERT INTO rooms (id_user, date_create, uuid_room, is_opened) VALUES ($1, CURRENT_DATE, $2, false) RETURNING *', [id, uuidRoom]);
            if (room.rows.length > 0) {
                const access = await db.query(
                    'INSERT INTO accessroom (uuid_room, id_user) VALUES ($1, $2) RETURNING *',
                    [uuidRoom, id]
                );
                console.log(`Дали доступ к комнате ее владельцу по его id: ${access.rows[0].id_user}`);
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
    async setVisibleRoom(req, res){
        try {
            const uuid = req.body.uuid;
            const getPrivate = await db.query(
              'SELECT * from rooms WHERE uuid_room = $1',
              [uuid]
            );
            const visibleStatus = getPrivate.rows[0].is_opened;
            if (visibleStatus === true) {
                const visible = await db.query(
                    'UPDATE rooms SET is_opened = $1 WHERE uuid_room = $2 RETURNING *',
                    [false, uuid]
                );
                if (visible.rows.length > 0) {
                    res.json(false);
                }
            }
            else {
                const visible = await db.query(
                    'UPDATE rooms SET is_opened = $1 WHERE uuid_room = $2 RETURNING *',
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
    async getAllInfoRoom(req, res) {
        try {
            const uuid = req.params.uuid;
            const room = await db.query(
                'SELECT * from rooms WHERE uuid_room = $1',
                [uuid]
            );
            if (room.rows.length > 0) {
                res.json(room.rows[0]);
            }
            else {
                res.status(403).json({ answer: 'Такой комнаты не существует' });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async checkAccessToRoom(req, res) {
        try {
            const id = req.params.id;
            const uuid = req.params.uuid;
            const access = await db.query(
                'SELECT * FROM accessroom WHERE id_user = $1 AND uuid_room = $2',
                [id, uuid]
            );
            if (access.rows.length > 0) {
                res.json({answer: 'Доступ к этой комнате есть у пользователя'});
            }
            else {
                res.json({answer: 'Доступа к этой комнате нету у пользователя'});
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async giveAccessToUser(req, res) {
        try {
            const id = req.body.id;
            const uuid = req.body.uuid;
            const access = await db.query(
              'INSERT INTO accessroom (uuid_room, id_user) VALUES ($1, $2)',
              [uuid, id]
            );
            res.json('');
        }
        catch (e) {
            console.log(e);
        }
    }
    async createMessage(req, res) {
        try {
            const { uuid, id, message } = req.body;
            const sanitizedMessage = message.substring(0, 150);
            const comment = await db.query(
                'INSERT INTO chat (id_room, id_user, comment, date_message) VALUES ($1, $2, $3, CURRENT_TIME) RETURNING *',
                [uuid, id, sanitizedMessage]
            );
            res.send(comment.rows[0].comment);
        }
        catch (e) {
            console.log(e);
        }
    }
    async getMessages(req, res) {
        try {
            const uuid = req.params.uuid;
            const messages = await db.query(
              'SELECT name_user, comment, date_message FROM chat INNER JOIN users u on u.id_user = chat.id_user WHERE id_room = $1 ORDER BY id_comment ASC',
                [uuid]
            );
            res.json(messages.rows);
        }
        catch (e) {
            console.log(e);
        }
    }
}

export default new RoomHandler();

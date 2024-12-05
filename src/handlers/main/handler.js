import db from '../../db.js';
class MainHandler {
    async Authorization(req, res) {
        try {
            const email = req.params.email;
            const password = req.params.password;
            const user = await db.query(
                'SELECT * FROM users WHERE email_user = $1 AND password_user = $2',
                [email, password]
            );

            if (user.rows.length > 0) {
                res.json(user.rows[0]);
            } else {
                res.status(401).json({ error: 'Пользователь с такой почтой и паролем не найден' });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
    async getUser(req, res) {
        try {
            const id = req.params.id;
            const user = await db.query(
              'SELECT * FROM users WHERE id_user = $1',
                [id]
            );
            if (user.rows.length > 0) {
                res.json(user.rows[0]);
            }
            else {
                res.status(401).json({ error: 'У вас нет прав доступа' });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({error: 'Внутренняя ошибка'});
        }
    }
}

export default new MainHandler();

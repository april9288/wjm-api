const routes = require('express').Router();
const auth = require('../../middleware/auth');
const pool = require('../../database/index');

routes.get('/', auth, async (req, res) => {
    const { id } = req;

    if (id) {
        try {
            const loginQuery = {
                text: `select id, email, uuid, photo100 from users where id = $1`,
                values: [Number(id)]
            };

            const result = await pool.query(loginQuery);

            const successMessage = {
                login: true,
                id: result.rows[0].id,
                userEmail: result.rows[0].email,
                uuid: result.rows[0].uuid,
                photo100: result.rows[0].photo100
            };

            res.status(200).send(successMessage);
        } catch (e) {
            res.status(400).send({ login: 'denied' });
        }
    } else {
        res.status(400).send({ login: 'denied' });
    }
});

module.exports = routes;

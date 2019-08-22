const routes = require('express').Router();

const auth = require('../../middleware/auth');
const pool = require('../../database/index');

routes.post('/', auth, async (req, res) => {
    const { pid } = req.body;
    const { email } = req;

    const editPostQuery = {
        text: `update posts set password = $3 where id = $1 and email = $2`,
        values: [pid, email]
    };

    try {
        await pool.query(editPostQuery);
        const successMessage = {
            status: true,
            message: 'post successfully updated'
        };
        res.status(200).send(successMessage);
    } catch (e) {
        res.status(400).send({ status: false });
    }
});

module.exports = routes;

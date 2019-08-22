const routes = require('express').Router();

const auth = require('../../middleware/auth');
const pool = require('../../database/index');

routes.delete('/:uuid', auth, async (req, res) => {
    const { id } = req;
    const { uuid } = req.params;

    const deletePostQuery = {
        text: `delete from posts where uid = $1 and uuid = $2`,
        values: [id, uuid]
    };

    try {
        await pool.query(deletePostQuery);
        const successMessage = {
            status: 'deleted',
            uuid
        };

        res.status(200).send(successMessage);
    } catch (err) {
        res.status(400).send({ status: false, err });
    }
});

module.exports = routes;

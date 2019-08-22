const routes = require('express').Router();

const pool = require('../database/index');

routes.delete('/', async (req, res) => {
    const { uuid } = req.body;

    const deletePostQuery = {
        text: `delete from posts where uuid = $1`,
        values: [uuid]
    };

    try {
        await pool.query(deletePostQuery);
        const successMessage = {
            status: true
        };

        res.status(200).send(successMessage);
    } catch (err) {
        res.status(400).send({ status: false, err });
    }
});

module.exports = routes;

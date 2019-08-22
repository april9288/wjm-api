const routes = require('express').Router();

const pool = require('../../database/index');

routes.get('/:uuid', async (req, res) => {
    const { uuid } = req.params;

    const postDetailQuery = {
        text:
            'select p.id, p.uuid, u.email, u.id as user_private_id, u.uuid as user_public_id, u.photo100 as user_photo100, p.photo550, p.photo100, p.title, p.description, p.category, p.brand, p.status, p.condition, p.quantity, p.price, p.timestamps from posts as p left join users as u on p.uid = u.id where p.uuid = $1',
        values: [uuid]
    };

    try {
        const result = await pool.query(postDetailQuery);

        const successMessage = {
            status: true,
            feedData: result.rows[0]
        };

        res.status(200).send(successMessage);
    } catch (err) {
        res.status(400).send({ status: false, err });
    }
});

module.exports = routes;

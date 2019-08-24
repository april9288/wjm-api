const routes = require('express').Router();
const auth = require('../../middleware/auth');
const pool = require('../../database/index');

routes.get('/', async (req, res) => {
    const { offset } = req.query;

    if (offset === undefined) {
        return res
            .status(400)
            .send({ status: false, err: 'No Offset Provided' });
    }

    try {
        const getPostQuery = {
            text:
                'select distinct p.id, p.uuid, u.email, u.id as user_private_id, u.uuid as user_public_id, u.photo100 as user_photo100, p.photo400, p.title, p.price, p.category, p.status, p.timestamps from posts as p left join users as u on p.uid = u.id where p.status = $1 order by timestamps desc limit 4 offset $2',
            values: ['on sale', offset]
        };

        const result = await pool.query(getPostQuery);

        const successMessage = {
            status: true,
            feedData: result.rows
        };

        res.status(200).send(successMessage);
    } catch (err) {
        res.status(400).send({ status: false, err });
    }
});

routes.get('/me', auth, async (req, res) => {
    const { id } = req;

    try {
        const getPostQuery = {
            text: `select id, uuid, photo400, title, price, category, status, timestamps from posts where uid = $1`,
            values: [id]
        };

        const postData = await pool.query(getPostQuery);

        const successMessage = {
            status: true,
            feedData: postData.rows
        };

        res.status(200).send(successMessage);
    } catch (err) {
        res.status(400).send({ status: false, err });
    }
});

routes.get('/:uuid', async (req, res) => {
    const { uuid } = req.params;

    try {
        // converting uuid to the corresponding user id
        const getIDQuery = {
            text: 'select id from users where uuid = $1',
            values: [uuid]
        };
        const getID = await pool.query(getIDQuery);
        const { id } = getID.rows[0];

        const getPostQuery = {
            text: `select id, uid, uuid, photo400, title, price, category, status, timestamps from posts where uid = $1`,
            values: [id]
        };

        const postData = await pool.query(getPostQuery);

        const successMessage = {
            status: id,
            feedData: postData.rows
        };
        res.status(200).send(successMessage);
    } catch (err) {
        res.status(400).send({ status: false, err });
    }
});

module.exports = routes;

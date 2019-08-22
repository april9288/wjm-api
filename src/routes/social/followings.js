const routes = require('express').Router();
const pool = require('../../database/index');
const auth = require('../../middleware/auth');
const followingsHelper = require('./followingsHelper');

// retrieving all data
routes.get('/all', async (req, res) => {
    const followingQuery = {
        text: 'select * from followings'
    };

    try {
        const result = await pool.query(followingQuery);
        res.status(200).send(result.rows);
    } catch (e) {
        res.status(400).send({ status: false });
    }
});

// retrieving data
routes.get('/me', auth, async (req, res) => {
    const { id } = req;

    try {
        const result = await followingsHelper(id);
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send({ status: false, err });
    }
});

// retrieving data
routes.get('/:uuid', async (req, res) => {
    const { uuid } = req.params;

    // converting uuid to the corresponding user id
    const getIDQuery = {
        text: 'select id from users where uuid = $1',
        values: [uuid]
    };

    const getID = await pool.query(getIDQuery);
    const { id } = getID.rows[0];

    try {
        // using user id to retrieve following data
        const result = await followingsHelper(id);
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send({ status: false, err });
    }
});

// following
routes.post('/', auth, async (req, res) => {
    const { id } = req;
    const { followed } = req.body;

    const followingQuery = {
        text: 'INSERT INTO followings (follower, followed) VALUES($1, $2)',
        values: [id, followed]
    };

    try {
        await pool.query(followingQuery);
        const result = await followingsHelper(id);
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send({ status: false, error: e.constraint });
    }
});

// unfollowing
routes.delete('/', auth, async (req, res) => {
    const { id } = req;
    const { followed } = req.body;

    const followingQuery = {
        text: 'delete from followings where follower = $1 and followed = $2',
        values: [id, followed]
    };

    try {
        await pool.query(followingQuery);
        const result = await followingsHelper(id);
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send({ status: false });
    }
});

routes.get('/seed', async (req, res) => {
    const followerGen = () => {
        return Math.floor(Math.random() * 80);
    };

    const followedGen = () => {
        return Math.floor(Math.random() * 80);
    };

    // eslint-disable-next-line prefer-const
    let follower = followerGen();
    let followed = followedGen();
    if (follower === followed) {
        // eslint-disable-next-line no-plusplus
        followed++;
    }

    const followingQuery = {
        text: 'INSERT INTO followings (follower, followed) VALUES($1, $2)',
        values: [follower, followed]
    };

    try {
        await pool.query(followingQuery);
        res.status(200).send('done');
    } catch (e) {
        res.status(400).send('error');
    }
});

module.exports = routes;

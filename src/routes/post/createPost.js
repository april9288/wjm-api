const multer = require('multer');
const routes = require('express').Router();
const uuidv1 = require('uuid/v1');

const auth = require('../../middleware/auth');
const pool = require('../../database/index');
const uploadHelper = require('../../uploadPhoto/uploadHelper');

routes.post('/', auth, multer().single('image'), async (req, res) => {
    const { id, file } = req;
    const { title, description, category, brand, condition, price } = req.body;

    try {
        // handling response from AWS S3 (buffer , size)
        const photo550 = await uploadHelper(file, 550);
        const photo400 = await uploadHelper(file, 400);
        const photo100 = await uploadHelper(file, 100);

        const uuid = uuidv1();
        // query for creating post
        const createPostQuery = {
            text:
                'INSERT INTO posts(uid, uuid, status, photo550, photo400, photo100, title, description, category, brand, condition, quantity, price, timestamps) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
            values: [
                id,
                uuid,
                'on sale',
                photo550,
                photo400,
                photo100,
                title,
                description,
                category,
                brand,
                condition,
                1,
                price,
                new Date()
            ]
        };

        // creating post in DB
        await pool.query(createPostQuery);

        // formating response message
        const successMessage = {
            status: 'posted',
            uuid
        };

        res.status(201).send(successMessage);
    } catch (err) {
        // handling error from AWS S3
        res.status(400).send({ status: false, err });
    }
});

module.exports = routes;

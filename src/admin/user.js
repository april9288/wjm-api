const axios = require('axios');
const routes = require('express').Router();
const pool = require('../database/index');

routes.patch('/photo', async (req, res) => {
    const getID = {
        text: `select data from testings where id = 1`
    };

    const getID_DB_Response = await pool.query(getID);
    const { data } = getID_DB_Response.rows[0];

    const response = await axios(
        'https://api.unsplash.com/photos/random?query=portrait&w=550&h=550',
        {
            headers: {
                Authorization: process.env.UNSPLASH_API
            }
        }
    );
    const photo550 = response.data.urls.custom;
    const photo400 = photo550.replace('w=550&h=550', 'w=400&h=400');
    const photo100 = photo550.replace('w=550&h=550', 'w=100&h=100');

    // const randomNum = Math.floor(Math.random() * 80 + 1);

    const changePhoto = {
        text: `update users set photo400 = $1, photo100 = $2 where id = $3`,
        values: [photo400, photo100, data]
    };

    await pool.query(changePhoto);

    let newID = data + 1;

    const updateID = {
        text: `update testings set data = $1 where id = 1`,
        values: [newID]
    };

    const DB_Response = await pool.query(updateID);

    const successMessage = {
        status: true,
        photo: photo400
        // result: DB_Response.rows[0]
    };
    res.status(200).send(successMessage);
});

module.exports = routes;

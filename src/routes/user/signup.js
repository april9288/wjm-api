const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');

const routes = require('express').Router();
const pool = require('../../database/index');

const defaultCover1000 = () => {
    // generating random cover photo from a set of 6 photos
    const randomNum = Math.floor(Math.random() * 6 + 1);
    return `https://woojoo.s3-us-west-1.amazonaws.com/c${randomNum}.png`;
};

routes.post('/', async (req, res) => {
    const { email, password } = req.body;

    // hashing user password input
    const hashedpw = await bcrypt.hash(
        password,
        Number(process.env.BCRYPT_SALT)
    );

    const signupQuery = {
        text:
            'INSERT INTO users(email, password, uuid, photo400, photo100, cover1000, firstname, lastname, phone, website, info, timestamps) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id, email, uuid, photo100',
        values: [
            email,
            hashedpw,
            uuidv1(),
            '',
            '',
            defaultCover1000(),
            '',
            '',
            '',
            '',
            '',
            new Date()
        ]
    };

    try {
        // creating new user
        const result = await pool.query(signupQuery);
        const { id } = result.rows[0];

        const addressQuery = {
            text:
                'INSERT INTO addresses (uid, address1, address2, city, state, zipcode) VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, '', '', '', '', 0]
        };

        await pool.query(addressQuery);

        // creating new token
        const token = jwt.sign({ id }, process.env.TOKEN_SECRET);

        // storing the token into DB
        const jwtTokenQuery = {
            text: 'INSERT INTO tokens(token , uid) VALUES($1, $2)',
            values: [token, id]
        };
        await pool.query(jwtTokenQuery);

        // formating response message
        const successMessage = {
            login: true,
            id,
            userEmail: result.rows[0].email,
            uuid: result.rows[0].uuid,
            photo100: result.rows[0].photo100
        };

        const cookieOptions = {
            httpOnly: true
        };

        // sending cookie to user
        res.cookie('WJM_TOKEN', token, cookieOptions);
        res.status(201).send(successMessage);
    } catch (error) {
        let errMessage = error;
        if (error.constraint === 'users_email_key') {
            errMessage = 'duplicate';
        }
        res.status(400).send({ login: 'denied', errMessage });
    }
});

module.exports = routes;

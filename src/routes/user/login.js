const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const routes = require('express').Router();
const pool = require('../../database/index');
const forgotPasswordEmail = require('../../email/forgotPassword');

routes.post('/', async (req, res) => {
    const { email, password } = req.body;

    const loginQuery = {
        text: `select * from users where email = $1`,
        values: [email]
    };

    try {
        // retriving user information
        const result = await pool.query(loginQuery);
        const { id } = result.rows[0];

        // comparing passwords
        const isMatch = await bcrypt.compare(password, result.rows[0].password);

        if (isMatch) {
            // creating new token
            const token = jwt.sign({ id }, process.env.TOKEN_SECRET);

            // querying to insert new token into DB
            const jwtTokenQuery = {
                text: 'INSERT INTO tokens(token , uid) VALUES($1, $2)',
                values: [token, id]
            };

            // storing the token into DB
            await pool.query(jwtTokenQuery);

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

            res.cookie('WJM_TOKEN', token, cookieOptions);
            res.status(200).send(successMessage);
        } else {
            // passwords do not match
            const errMessage = 'passwords';
            res.status(400).send({ login: 'denied', errMessage });
        }
    } catch (e) {
        // system error
        const errMessage = 'system';
        res.status(400).send({ login: 'denied', errMessage });
    }
});

routes.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;

    // generating new random password
    const tempPassword = new Date().getTime();

    // hashing the random password
    const hashedpw = await bcrypt.hash(
        String(tempPassword),
        Number(process.env.BCRYPT_SALT)
    );

    // storing the temp password in DB
    const forgotPasswordQuery = {
        text: `update users set password = $1 where email = $2 `,
        values: [hashedpw, email]
    };

    try {
        // sending an email to inform the temporary password
        const emailResponse = await forgotPasswordEmail(email, tempPassword);

        // updating password
        await pool.query(forgotPasswordQuery);

        // formating a message
        const successMessage = {
            status: true,
            message: 'temp password has been sent via email',
            emailResponse
        };
        res.status(200).send(successMessage);
    } catch (e) {
        res.status(400).send({ status: false });
    }
});

module.exports = routes;

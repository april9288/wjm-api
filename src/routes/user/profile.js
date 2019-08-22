const bcrypt = require('bcryptjs');

const routes = require('express').Router();
const pool = require('../../database/index');
const auth = require('../../middleware/auth');

routes.get('/test/:id', async (req, res) => {
    const { id } = req.params;

    const profileQuery = {
        text: `select email, firstname from users where id = $1`,
        values: [id]
    };

    try {
        const profileData = await pool.query(profileQuery);

        const successMessage = {
            ...profileData.rows[0],
            status: null
        };
        res.status(200).send(successMessage);
    } catch (e) {
        res.status(400).send({ status: false });
    }
});

routes.get('/:uuid', async (req, res) => {
    const { uuid } = req.params;

    const profileQuery = {
        text: `select id, email, photo400, cover1000, firstname, lastname, phone, website, info from users where uuid = $1`,
        values: [uuid]
    };

    try {
        const profileData = await pool.query(profileQuery);

        const successMessage = {
            ...profileData.rows[0],
            status: null
        };
        res.status(200).send(successMessage);
    } catch (e) {
        res.status(400).send({ status: false });
    }
});

routes.patch('/password', auth, async (req, res) => {
    const { id } = req;
    const { newPassword } = req.body;

    // hashing new password
    const hashedpw = await bcrypt.hash(
        newPassword,
        Number(process.env.BCRYPT_SALT)
    );

    const changePasswordQuery = {
        text: `update users set password = $1 where id = $2`,
        values: [hashedpw, id]
    };

    try {
        // updating password
        await pool.query(changePasswordQuery);

        // success message formating
        const successMessage = {
            newPassword: '',
            newPassword2: '',
            status: true,
            message: 'password successfully changed',
            error: null
        };

        res.status(200).send(successMessage);
    } catch (error) {
        const errorMessage = {
            newPassword: '',
            newPassword2: '',
            status: false,
            message: null,
            error
        };
        res.status(400).send(errorMessage);
    }
});

routes.delete('/', auth, async (req, res) => {
    const { id } = req;

    const deleteUserQuery = {
        text: `delete from users where id = $1`,
        values: [id]
    };

    try {
        await pool.query(deleteUserQuery);
        const successMessage = {
            status: true,
            message: 'user successfully deleted',
            error: null
        };
        res.clearCookie('WJM_TOKEN');
        res.status(200).send(successMessage);
    } catch (error) {
        const errorMessage = {
            status: false,
            message: null,
            error
        };
        res.status(400).send(errorMessage);
    }
});

module.exports = routes;

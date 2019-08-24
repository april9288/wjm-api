const multer = require('multer');
const routes = require('express').Router();

const pool = require('../../database/index');
const auth = require('../../middleware/auth');
const uploadHelper = require('../../uploadPhoto/uploadHelper');

routes.get('/', auth, async (req, res) => {
    const { id } = req;

    const profileQuery = {
        text: `select u.photo400, u.firstname,u.lastname,u.phone,u.website,u.info,a.address1,a.address2,a.city,a.state,a.zipcode from users as u left join addresses as a on u.id = a.uid where u.id = $1`,
        values: [id]
    };

    try {
        const profileData = await pool.query(profileQuery);

        const successMessage = {
            ...profileData.rows[0],
            status: null,
            stay: true
        };
        res.status(200).send(successMessage);
    } catch (e) {
        res.status(400).send({ status: false });
    }
});

routes.post('/', auth, multer().single('photo400'), async (req, res) => {
    const { id, file } = req;
    const {
        firstname,
        lastname,
        phone,
        website,
        info,
        address1,
        address2,
        city,
        state,
        zipcode
    } = req.body;

    let photo400;
    let photo100;
    try {
        // if photo is not empty,
        photo400 = await uploadHelper(file, 400);
        photo100 = await uploadHelper(file, 100);
    } catch (e) {
        // if photo is empty,
        photo400 = '';
        photo100 = '';
    }

    try {
        const updateUserQuery = {
            text: `update users set firstname = $2, lastname = $3, phone = $4, website = $5, info = $6, photo400 = $7, photo100 = $8 where id = $1`,
            values: [
                id,
                firstname,
                lastname,
                phone,
                website,
                info,
                photo400,
                photo100
            ]
        };

        // updating user profile
        await pool.query(updateUserQuery);

        const updateAddressQuery = {
            text: `update addresses set address1 = $2, address2 = $3, city = $4, state = $5, zipcode = $6 where uid = $1`,
            values: [id, address1, address2, city, state, zipcode]
        };

        const updateAddress = await pool.query(updateAddressQuery);
        if (updateAddress.rowCount === 0) {
            const insertAddressQuery = {
                text:
                    'INSERT INTO addresses (uid, address1, address2, city, state, zipcode) VALUES($1, $2, $3, $4, $5, $6)',
                values: [id, address1, address2, city, state, zipcode]
            };
            await pool.query(insertAddressQuery);
        }

        const successMessage = {
            status: 'updated'
        };
        res.status(201).send(successMessage);
    } catch (e) {
        res.status(400).send({ status: false, e });
    }
});

module.exports = routes;

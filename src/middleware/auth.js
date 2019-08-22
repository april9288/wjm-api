const jwt = require('jsonwebtoken');
const pool = require('../database/index');

const auth = async (req, res, next) => {
    const userCookie = req.cookies.WJM_TOKEN;
    if (!userCookie) {
        return res.status(400).send({
            login: 'denied',
            message: 'AUTH_ERROR'
        });
    }

    try {
        const decoded = jwt.verify(userCookie, process.env.TOKEN_SECRET);
        const jwtTokenQuery = {
            text: 'select * from tokens where token = $1',
            values: [userCookie]
        };
        const result = await pool.query(jwtTokenQuery);
        if (decoded.id === result.rows[0].uid) {
            req.id = decoded.id;
            next();
        } else {
            return res.status(400).send({
                login: 'denied',
                message: 'AUTH_ERROR'
            });
        }
    } catch (e) {
        return res.status(400).send({
            login: 'denied',
            message: 'AUTH_ERROR'
        });
    }
};

module.exports = auth;

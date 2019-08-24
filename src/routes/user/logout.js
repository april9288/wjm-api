const routes = require('express').Router();

routes.get('/', async (req, res) => {
    res.clearCookie('WJM_TOKEN');
    res.status(200).send({
        login: false,
        id: null,
        userEmail: '',
        uuid: '',
        photo100: '',
        error: null
    });
});

module.exports = routes;

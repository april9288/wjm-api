const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const routes = require('express').Router();
// const pool = require('../../database/index');
const auth = require('../../middleware/auth');

routes.post('/', auth, async (req, res) => {
    // const { id } = req;
    const { token, amount } = req.body;

    const paymentData = {
        source: token.id,
        amount,
        currency: 'usd'
    };

    stripe.charges.create(paymentData, (err, success) => {
        if (err) {
            res.status(400).send({ paymentData: 'error' });
        } else {
            res.status(200).send({ paymentData: success });
        }
    });
});

module.exports = routes;

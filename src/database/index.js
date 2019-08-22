const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.POSTGRES_URL,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PW,
    port: process.env.POSTGRES_PORT
});

// eslint-disable-next-line consistent-return
pool.query('SELECT NOW()', err => {
    if (err) {
        return console.log('Postgres got an error : ', err);
    }
    console.log('Postgres is up and running on 5432');
});

module.exports = {
    query: (text, values, cb) => pool.query(text, values, cb)
};

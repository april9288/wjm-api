const request = require('supertest');

const app = require('../../../src/app');
const pool = require('../../../src/database/index');

const testUser = {
    email: 'james@k.com',
    password: 'abcd'
};

beforeAll(async () => {
    const clearDatabaseQuery = {
        text: 'delete from users where email = $1',
        values: [testUser.email]
    };
    await pool.query(clearDatabaseQuery);
});

describe('Should test the login system', () => {
    test('Should sign up a new user', async () => {
        await request(app)
            .post('/api/signup')
            .send(testUser)
            .expect('Set-Cookie', /WJM_TOKEN/)
            .expect('Access-Control-Allow-Credentials', 'true')
            .expect(201)
            .expect(({ body }) => {
                const { login, id, userEmail, uuid, photo100 } = body;
                expect(login).toBe(true);
                expect(typeof id).toBe('number');
                expect(userEmail).toBe('james@k.com');
                expect(typeof uuid).toBe('string');
                expect(photo100).toBe('');
            });
    });

    test('Should log in with the existing account', async () => {
        await request(app)
            .post('/api/login')
            .send(testUser)
            .expect('Set-Cookie', /WJM_TOKEN/)
            .expect('Access-Control-Allow-Credentials', 'true')
            .expect(200)
            .expect(({ body }) => {
                const { login, id, userEmail, uuid, photo100 } = body;
                expect(login).toBe(true);
                expect(typeof id).toBe('number');
                expect(userEmail).toBe('james@k.com');
                expect(typeof uuid).toBe('string');
                expect(photo100).toBe('');
            });
    });

    test('Should throw 400 with a wrong password', async () => {
        await request(app)
            .post('/api/login')
            .send({
                email: 'james@k.com',
                password: 'aaa'
            })
            .expect(400)
            .expect(({ body }) => {
                const { login, errMessage } = body;
                expect(login).toBe('denied');
                expect(errMessage).toBe('passwords');
            });
    });

    test('Should throw 400 with non-existing account', async () => {
        await request(app)
            .post('/api/login')
            .send({
                email: 'banana@g.com',
                password: 'abc'
            })
            .expect(400)
            .expect(({ body }) => {
                const { login, errMessage } = body;
                expect(login).toBe('denied');
                expect(errMessage).toBe('system');
            });
    });
});

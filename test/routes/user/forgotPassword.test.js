const request = require('supertest');

const app = require('../../../src/app');
const pool = require('../../../src/database/index');

const testUser = {
    email: 'pikachu@k.com',
    password: 'abcd'
};

beforeAll(async () => {
    const clearDatabaseQuery = {
        text: 'delete from users where email = $1',
        values: [testUser.email]
    };
    await pool.query(clearDatabaseQuery);
});

afterAll(async () => {
    const clearDatabaseQuery = {
        text: 'delete from users where email = $1',
        values: [testUser.email]
    };
    await pool.query(clearDatabaseQuery);
});

describe('Should test 200 cases for /api/login/forgotPassword', () => {
    test('Should register a fake user', async () => {
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
                expect(userEmail).toBe('pikachu@k.com');
                expect(typeof uuid).toBe('string');
                expect(photo100).toBe('');
            });
    });

    test('Should successfully send an email with a temporary password', async () => {
        await request(app)
            .post('/api/login/forgotPassword')
            .send(testUser)
            .expect(200)
            .expect(({ body }) => {
                const { status, message } = body;
                expect(status).toBe(true);
                expect(message).toBe('temp password has been sent via email');
            });
    });
});

describe('Should test 400 cases for /api/login/forgotPassword', () => {
    test('Should throw 400 when user does not provide email', async () => {
        await request(app)
            .post('/api/login/forgotPassword')
            .expect(400)
            .expect(({ body }) => {
                const { status } = body;
                expect(status).toBe(false);
            });
    });

    test('Should throw 400 with non-existing account', async () => {
        await request(app)
            .post('/api/login/forgotPassword')
            .send({
                email: 'fireball@g.com'
            })
            .expect(400)
            .expect(({ body }) => {
                const { status, message } = body;
                expect(status).toBe(false);
                expect(message).toBe('No such user exists');
            });
    });
});

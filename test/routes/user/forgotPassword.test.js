const request = require('supertest');

const app = require('../../../src/app');
const pool = require('../../../src/database/index');

const testUser = {
    email: 'pikachu123@k.com',
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
            .expect(201);
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

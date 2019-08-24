const request = require('supertest');

const app = require('../../../src/app');
const pool = require('../../../src/database/index');

const testUser = {
    email: 'pikachu456@k.com',
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

describe('Should test the changing password endpoint', () => {
    let cookieForTest = '';

    test('Should register a fake user', async () => {
        await request(app)
            .post('/api/signup')
            .send(testUser)
            .expect(({ headers }) => {
                // re-assign cookieForTest to this real cookie
                cookieForTest = headers['set-cookie'][0].split(';')[0];
            });
    });

    test('Should pass the test with the http 200 status code', async () => {
        await request(app)
            .patch('/api/profile/password')
            .set('Cookie', [cookieForTest])
            .send({
                newPassword: 'THIS_IS_NEW_PASSWORD'
            })
            .expect(200)
            .expect(({ body }) => {
                const {
                    newPassword,
                    newPassword2,
                    status,
                    message,
                    error
                } = body;
                expect(newPassword).toBe('');
                expect(newPassword2).toBe('');
                expect(status).toBe(true);
                expect(message).toBe('password successfully changed');
                expect(error).toBe(null);
            });
    });

    test('Should fail the test if there is no valid cookie', async () => {
        await request(app)
            .patch('/api/profile/password')
            .send({
                newPassword: 'THIS_IS_NEW_PASSWORD'
            })
            .expect(400)
            .expect(({ body }) => {
                const { login, message } = body;
                expect(login).toBe('denied');
                expect(message).toBe('AUTH_ERROR');
            });
    });

    test('Should fail the test if there is no newPassword input', async () => {
        await request(app)
            .patch('/api/profile/password')
            .set('Cookie', [cookieForTest])
            .expect(400)
            .expect(({ body }) => {
                const { status, message } = body;
                expect(status).toBe(false);
                expect(message).toBe('No Input Provided');
            });
    });
});

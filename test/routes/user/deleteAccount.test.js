const request = require('supertest');

const app = require('../../../src/app');
const pool = require('../../../src/database/index');

const testUser = {
    email: 'pikachu135@k.com',
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

describe('Should test the removing user account endpoint', () => {
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
            .delete('/api/profile')
            .set('Cookie', [cookieForTest])
            .expect(200)
            .expect('Set-Cookie', /WJM_TOKEN=;/)
            .expect(({ body }) => {
                const { status, message, error } = body;
                expect(status).toBe(true);
                expect(message).toBe('user successfully deleted');
                expect(error).toBe(null);
            });
    });

    test('Should fail the test if there is no valid cookie', async () => {
        await request(app)
            .delete('/api/profile')
            .expect(400)
            .expect(({ body }) => {
                const { login, message } = body;
                expect(login).toBe('denied');
                expect(message).toBe('AUTH_ERROR');
            });
    });
});

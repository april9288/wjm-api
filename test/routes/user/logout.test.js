const request = require('supertest');

const app = require('../../../src/app');
const pool = require('../../../src/database/index');

const testUser = {
    email: 'pikachu246@k.com',
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

describe('Should test the logging out endpoint', () => {
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
            .get('/api/logout')
            .expect(200)
            .expect('Set-Cookie', /WJM_TOKEN=;/)
            .expect(({ body }) => {
                const { login, id, userEmail, uuid, photo100, error } = body;
                expect(login).toBe(false);
                expect(id).toBe(null);
                expect(userEmail).toBe('');
                expect(uuid).toBe('');
                expect(photo100).toBe('');
                expect(error).toBe(null);
            });
    });
});

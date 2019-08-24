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

describe('Should test authentication', () => {
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

    test('Should receive personal data with the 200 http status code', async () => {
        await request(app)
            .get('/api/checkAuth')
            .set('Cookie', [cookieForTest])
            .expect(200)
            .expect(({ body }) => {
                const { login, id, userEmail, uuid, photo100 } = body;
                expect(login).toBe(true);
                expect(typeof id).toBe('number');
                expect(userEmail).toBe('pikachu@k.com');
                expect(typeof uuid).toBe('string');
                expect(photo100).toBe('');
            });
    });

    test('Should throw 400 if there is no cookie sent', async () => {
        await request(app)
            .get('/api/checkAuth')
            .expect(400)
            .expect(({ body }) => {
                const { login, message } = body;
                expect(login).toBe('denied');
                expect(message).toBe('AUTH_ERROR');
            });
    });

    test('Should throw 400 if JWT is not valid', async () => {
        await request(app)
            .get('/api/checkAuth')
            .set('Cookie', ['WJM_TOKEN=THIS_IS_NOT_VALID_JWT'])
            .expect(400)
            .expect(({ body }) => {
                const { login, message } = body;
                expect(login).toBe('denied');
                expect(message).toBe('AUTH_ERROR');
            });
    });
});

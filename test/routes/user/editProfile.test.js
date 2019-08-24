const request = require('supertest');

const app = require('../../../src/app');
const pool = require('../../../src/database/index');

const testUser = {
    email: 'water123@k.com',
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

describe('Should test the editing profile endpoint', () => {
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
            .get('/api/editProfile')
            .set('Cookie', [cookieForTest])
            .expect(200)
            .expect(({ body }) => {
                const {
                    photo400,
                    firstname,
                    lastname,
                    phone,
                    website,
                    info,
                    status,
                    stay
                } = body;
                expect(photo400).toBe('');
                expect(firstname).toBe('');
                expect(lastname).toBe('');
                expect(phone).toBe('');
                expect(website).toBe('');
                expect(info).toBe('');
                expect(status).toBe(null);
                expect(stay).toBe(true);
            });
    });
});

const request = require('supertest');

const app = require('../../../src/app');
const pool = require('../../../src/database/index');

const testUser = {
    email: 'pikachu789@k.com',
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

describe('Should test /api/profile', () => {
    let uuidForTest = '';

    test('Should register a fake user', async () => {
        await request(app)
            .post('/api/signup')
            .send(testUser)
            .expect('Set-Cookie', /WJM_TOKEN/)
            .expect('Access-Control-Allow-Credentials', 'true')
            .expect(201)
            .expect(({ body }) => {
                const { login, id, userEmail, uuid, photo100 } = body;

                // re-assign uuidForTest to uuid's string value
                uuidForTest = uuid;

                expect(login).toBe(true);
                expect(typeof id).toBe('number');
                expect(userEmail).toBe('pikachu789@k.com');
                expect(typeof uuid).toBe('string');
                expect(photo100).toBe('');
            });
    });

    test('Should receive personal data with the 200 http status code', async () => {
        await request(app)
            .get(`/api/profile/${uuidForTest}`)
            .send(testUser)
            .expect(200)
            .expect(({ body }) => {
                const {
                    id,
                    email,
                    photo400,
                    cover1000,
                    firstname,
                    lastname,
                    phone,
                    website,
                    info,
                    status
                } = body;
                expect(typeof id).toBe('number');
                expect(email).toBe('pikachu789@k.com');
                expect(photo400).toBe('');
                expect(cover1000).toBeTruthy();
                expect(firstname).toBe('');
                expect(lastname).toBe('');
                expect(phone).toBe('');
                expect(website).toBe('');
                expect(info).toBe('');
                expect(status).toBe(null);
            });
    });

    test('Should throw 400 with non-excisting UUID', async () => {
        await request(app)
            .get(`/api/profile/non-existingUUID`)
            .send(testUser)
            .expect(400)
            .expect(({ body }) => {
                const { status } = body;
                expect(status).toBe(false);
            });
    });
});

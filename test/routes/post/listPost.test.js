const request = require('supertest');

const app = require('../../../src/app');
const pool = require('../../../src/database/index');

const testUser = {
    email: 'duck123@k.com',
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

describe('Should test new feed APIs', () => {
    let cookieForTest = '';
    let uuidForTest = '';

    test('Should register User 1', async () => {
        await request(app)
            .post('/api/signup')
            .send(testUser)
            .expect(({ headers }) => {
                // re-assign cookieForTest to this real cookie
                cookieForTest = headers['set-cookie'][0].split(';')[0];
            })
            .expect(({ body }) => {
                const { uuid } = body;
                uuidForTest = uuid;
            });
    });

    test('Should retrieve all the on-sale feed', async () => {
        await request(app)
            .get('/api/listPost/?offset=0')
            .expect(200)
            .expect(({ body }) => {
                const { status, feedData } = body;
                expect(status).toBe(true);
                expect(feedData.length).toBe(0);
            });
    });

    test('Should throw 400 if there is no offset query', async () => {
        await request(app)
            .get('/api/listPost')
            .expect(400)
            .expect(({ body }) => {
                const { status, err } = body;
                expect(status).toBe(false);
                expect(err).toBe('No Offset Provided');
            });
    });

    test('Should retrieve the feeds that I posted', async () => {
        await request(app)
            .get('/api/listPost/me')
            .set('Cookie', [cookieForTest])
            .expect(200)
            .expect(({ body }) => {
                const { status, feedData } = body;
                expect(status).toBe(true);
                expect(feedData.length).toBe(0);
            });
    });

    test('Should retrieve feeds by UUID', async () => {
        await request(app)
            .get(`/api/listPost/${uuidForTest}`)
            .set('Cookie', [cookieForTest])
            .expect(200)
            .expect(({ body }) => {
                const { feedData } = body;
                expect(feedData.length).toBe(0);
            });
    });

    test('Should throw 400 if the UUID is not valid', async () => {
        await request(app)
            .get(`/api/listPost/${uuidForTest}999999`)
            .set('Cookie', [cookieForTest])
            .expect(400)
            .expect(({ body }) => {
                const { status, err } = body;
                expect(status).toBe(false);
                expect(err.routine).toBe('string_to_uuid');
            });
    });
});

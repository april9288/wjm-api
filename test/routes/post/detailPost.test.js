const request = require('supertest');

const app = require('../../../src/app');
const pool = require('../../../src/database/index');

const testUser = {
    email: 'dog123@k.com',
    password: 'abcd'
};

beforeAll(async () => {
    const clearDatabaseQuery = {
        text: 'delete from users where email = $1',
        values: [testUser.email]
    };
    await pool.query(clearDatabaseQuery);

    const clearPostsQuery = {
        text: 'delete from posts'
    };
    await pool.query(clearPostsQuery);
});

afterAll(async () => {
    const clearDatabaseQuery = {
        text: 'delete from users where email = $1',
        values: [testUser.email]
    };
    await pool.query(clearDatabaseQuery);

    const clearPostsQuery = {
        text: 'delete from posts'
    };
    await pool.query(clearPostsQuery);
});

describe('Should retrieve detail data for a post using UUID', () => {
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

    test('Should successfully retrieve data', async () => {
        await request(app)
            .get(`/api/postDetail/${uuidForTest}`)
            .expect(200)
            .expect(({ body }) => {
                const { status } = body;
                expect(status).toBe(true);
            });
    });
});

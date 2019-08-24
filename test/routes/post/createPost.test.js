const request = require('supertest');

const app = require('../../../src/app');
const pool = require('../../../src/database/index');

const testUser = {
    email: 'cat123@k.com',
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

describe('Should test creating a post and deleting the post', () => {
    let cookieForTest = '';
    let uuidForTest = '';
    let pUUID = '';

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

    test('Should successfully submit a post', async () => {
        await request(app)
            .post('/api/createPost')
            .set('Cookie', [cookieForTest])
            .attach('image', 'test/samples/image2.jpg')
            .field('title', 'overwatch')
            .field('description', 'This is my watch')
            .field('category', 'watch')
            .field('brand', 'IDK')
            .field('condition', 'new')
            .field('price', 1000)
            .expect(201)
            .expect(({ body }) => {
                const { status, uuid } = body;
                pUUID = uuid;
                expect(status).toBe('posted');
                expect(typeof uuid).toBe('string');
            });
    });

    test('Should delete the post using UUID', async () => {
        await request(app)
            .delete(`/api/deletePost/${pUUID}`)
            .set('Cookie', [cookieForTest])
            .expect(200)
            .expect(({ body }) => {
                const { status, uuid } = body;
                expect(status).toBe('deleted');
                expect(uuid).toBe(pUUID);
            });
    });
});

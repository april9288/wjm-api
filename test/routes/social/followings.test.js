const request = require('supertest');

const app = require('../../../src/app');
const pool = require('../../../src/database/index');

const testUser = {
    email: 'torrance123@k.com',
    password: 'abcd'
};

const testUser2 = {
    email: 'orange123@k.com',
    password: 'abcd'
};

beforeAll(async () => {
    const clearDatabaseQuery = {
        text: 'delete from users where email = $1 or email = $2',
        values: [testUser.email, testUser2.email]
    };
    await pool.query(clearDatabaseQuery);
});

afterAll(async () => {
    const clearDatabaseQuery = {
        text: 'delete from users where email = $1 or email = $2',
        values: [testUser.email, testUser2.email]
    };
    await pool.query(clearDatabaseQuery);
});

describe('Should test social media APIs', () => {
    let cookieForTest = '';
    let uuidForTest = '';
    let idFor2ndUser;

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

    test('Should register User 2', async () => {
        await request(app)
            .post('/api/signup')
            .send(testUser2)
            .expect(({ body }) => {
                const { id } = body;
                idFor2ndUser = id;
            });
    });

    test('Should retrieve my following data', async () => {
        await request(app)
            .get('/api/following/me')
            .set('Cookie', [cookieForTest])
            .expect(200)
            .expect(({ body }) => {
                const { follower, following } = body;
                expect(follower.length).toBe(0);
                expect(following.length).toBe(0);
            });
    });

    test('Should throw 400 if there is no valid cookie', async () => {
        await request(app)
            .get('/api/following/me')
            .expect(400)
            .expect(({ body }) => {
                const { login, message } = body;
                expect(login).toBe('denied');
                expect(message).toBe('AUTH_ERROR');
            });
    });

    test('Should retrieve following data for a specific user', async () => {
        await request(app)
            .get(`/api/following/${uuidForTest}`)
            .expect(200)
            .expect(({ body }) => {
                const { follower, following } = body;
                expect(follower.length).toBe(0);
                expect(following.length).toBe(0);
            });
    });

    test('Should add a followed user to myself', async () => {
        await request(app)
            .post('/api/following')
            .set('Cookie', [cookieForTest])
            .send({
                followed: idFor2ndUser
            })
            .expect(({ body }) => {
                const { follower, following } = body;
                const { followed, email } = following[0];
                expect(follower.length).toBe(0);
                expect(followed).toBe(idFor2ndUser);
                expect(email).toBe(testUser2.email);
            });
    });

    test('Should delete User2 from the list of people who I follow', async () => {
        await request(app)
            .delete('/api/following')
            .set('Cookie', [cookieForTest])
            .send({
                followed: idFor2ndUser
            })
            .expect(({ body }) => {
                const { follower, following } = body;
                expect(follower.length).toBe(0);
                expect(following.length).toBe(0);
            });
    });
});

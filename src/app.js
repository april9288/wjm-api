const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const checkAuth = require('./routes/user/checkAuth');

const signupRouter = require('./routes/user/signup');
const loginRouter = require('./routes/user/login');
const logoutRouter = require('./routes/user/logout');
const profileRouter = require('./routes/user/profile');
const editProfileRouter = require('./routes/user/editProfile');

const createPostRouter = require('./routes/post/createPost');
const deletePostRouter = require('./routes/post/deletePost');
const listPostRouter = require('./routes/post/listPost');
const postDetailRouter = require('./routes/post/postDetail');

const followingRouter = require('./routes/social/followings');

const paymentRouter = require('./routes/payment/stripe');

const adminPostRouter = require('./admin/post');
const adminUserRouter = require('./admin/user');

const app = express();
app.use(
    cors({
        origin: process.env.SERVER_ORIGIN,
        credentials: true
    })
); // allowing us to skip the same origin policy

app.use(cookieParser()); // parsing cookies in headers
app.use(express.json()); // parsing body (in JSON format) in incoming requests

app.use('/api/checkAuth', checkAuth);

// routes/user
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/profile', profileRouter);
app.use('/api/editProfile', editProfileRouter);

// routes/post
app.use('/api/createPost', createPostRouter);
app.use('/api/deletePost', deletePostRouter);
app.use('/api/listPost', listPostRouter);
app.use('/api/postDetail', postDetailRouter);

// routes/social
app.use('/api/following', followingRouter);

// routes/payment
app.use('/api/payment', paymentRouter);

// routes/admin/post
app.use('/admin/post', adminPostRouter);
app.use('/admin/user', adminUserRouter);

module.exports = app;

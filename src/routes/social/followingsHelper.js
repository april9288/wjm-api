const pool = require('../../database/index');

// eslint-disable-next-line import/prefer-default-export
const followingsHelper = async id => {
    // my followers
    const followerQuery = {
        text:
            'select f.follower, u.email, u.uuid as user_public_id, u.photo100 as user_photo100 from followings as f left join users as u on f.follower = u.id where followed = $1',
        values: [id]
    };

    // who I am following
    const followingQuery = {
        text:
            'select f.followed, u.email, u.uuid as user_public_id, u.photo100 as user_photo100 from followings as f left join users as u on f.followed = u.id where follower = $1',
        values: [id]
    };

    try {
        // people who follow me
        const follower = await pool.query(followerQuery);
        // people who I follow
        const following = await pool.query(followingQuery);

        const successMessage = {
            follower: follower.rows,
            following: following.rows
        };

        return successMessage;
    } catch (e) {
        return e;
    }
};

module.exports = followingsHelper;

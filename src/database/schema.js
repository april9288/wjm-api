const Sequelize = require('sequelize');

const connection = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PW,
    {
        host: process.env.POSTGRES_URL,
        port: process.env.POSTGRES_PORT,
        dialect: 'postgres',
        logging: false
    }
);

connection
    .authenticate()
    .then(() => console.log('Postgres is up and running on 5432\n'))
    .catch(err => console.log('error : ', err));

// const Users = connection.define(
//     'users',
//     {
//         email: {
//             type: Sequelize.STRING(250),
//             unique: true
//         },
//         password: {
//             type: Sequelize.STRING(250)
//         },
//         uuid: {
//             type: Sequelize.UUID
//         },
//         photo400: {
//             type: Sequelize.STRING(250)
//         },
//         photo100: {
//             type: Sequelize.STRING(250)
//         },
//         cover1000: {
//             type: Sequelize.STRING(250)
//         },
//         firstname: {
//             type: Sequelize.STRING(250)
//         },
//         lastname: {
//             type: Sequelize.STRING(250)
//         },
//         phone: {
//             type: Sequelize.STRING(250)
//         },
//         website: {
//             type: Sequelize.STRING(250)
//         },
//         info: {
//             type: Sequelize.STRING(250)
//         },
//         timestamps: {
//             type: Sequelize.DATE
//         }
//     },
//     { timestamps: false }
// );

// const Address = connection.define(
//     'address',
//     {
//         uid: {
//             type: Sequelize.INTEGER
//         },
//         address1: {
//             type: Sequelize.STRING(250)
//         },
//         address2: {
//             type: Sequelize.STRING(250)
//         },
//         city: {
//             type: Sequelize.STRING(250)
//         },
//         state: {
//             type: Sequelize.STRING(250)
//         },
//         zipcode: {
//             type: Sequelize.INTEGER
//         }
//     },
//     { timestamps: false }
// );

// const Tokens = connection.define(
//     'tokens',
//     {
//         token: {
//             type: Sequelize.STRING(250)
//         },
//         uid: {
//             type: Sequelize.INTEGER
//         }
//     },
//     { timestamps: false }
// );

// const Following = connection.define(
//     'following',
//     {
//         follower: {
//             type: Sequelize.INTEGER
//         },
//         followed: {
//             type: Sequelize.INTEGER
//         }
//     },
//     {
//         indexes: [
//             {
//                 unique: true,
//                 fields: ['follower', 'followed']
//             }
//         ],
//         timestamps: false
//     }
// );

// const Posts = connection.define(
//     'posts',
//     {
//         uid: {
//             type: Sequelize.INTEGER
//         },
//         uuid: {
//             type: Sequelize.UUID
//         },
//         status: {
//             type: Sequelize.ENUM('on sale', 'on hold', 'sold')
//         },
//         photo550: {
//             type: Sequelize.STRING(250)
//         },
//         photo400: {
//             type: Sequelize.STRING(250)
//         },
//         photo100: {
//             type: Sequelize.STRING(250)
//         },
//         title: {
//             type: Sequelize.STRING(250)
//         },
//         description: {
//             type: Sequelize.STRING(250)
//         },
//         category: {
//             type: Sequelize.STRING(250)
//         },
//         brand: {
//             type: Sequelize.STRING(250)
//         },
//         condition: {
//             type: Sequelize.ENUM(
//                 'new',
//                 'used - like new',
//                 'used - very good',
//                 'used - good'
//             )
//         },
//         quantity: {
//             type: Sequelize.INTEGER
//         },
//         price: {
//             type: Sequelize.INTEGER
//         },
//         timestamps: {
//             type: Sequelize.DATE
//         }
//     },
//     { timestamps: false }
// );

const testing = connection.define(
    'testings',
    {
        data: {
            type: Sequelize.INTEGER
        }
    },
    { timestamps: false }
);

connection.sync({ force: false });

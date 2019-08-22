const fs = require('fs');
const axios = require('axios');
const faker = require('faker');
const uuidv1 = require('uuid/v1');

const writeStream = fs.createWriteStream('./src/database/seed/seed-post.csv', {
    flags: 'a'
});

const uidGenerator = () => {
    const randomNum = Math.floor(Math.random() * 80 + 1);
    return Number(randomNum);
};

const conditionGen = () => {
    const conditions = [
        'new',
        'used - like new',
        'used - very good',
        'used - good'
    ];
    const randomNum = Math.floor(Math.random() * 4);
    return conditions[randomNum];
};

const category = [
    'drone',
    'smart watch',
    'game',
    'headphones',
    'lego',
    'gundam',
    'camera',
    'robots',
    'boardgame',
    'starwars'
];

let counter = 297;

const sampleData = (photo550, photo400, photo100, product) => {
    let oneRow = '';
    let now = new Date();
    now.setHours(now.getHours() + 6);

    oneRow += `${counter}|`; // id
    oneRow += `${uidGenerator()}|`; // uid -> id from the table 'users'
    oneRow += `${uuidv1()}|`; // uuid
    oneRow += `on sale|`; // status
    oneRow += `${photo550}|`; // photo550
    oneRow += `${photo400}|`; // photo400
    oneRow += `${photo100}|`; // photo100

    oneRow += `${faker.commerce.productAdjective()} ${product}|`; // title
    oneRow += `${faker.lorem.sentence()}|`; // description
    oneRow += `${product}|`; // category
    oneRow += `${faker.company.companyName()}|`; // brand

    oneRow += `${conditionGen()}|`; // condition
    oneRow += `${Number(1)}|`; // quantity
    oneRow += `${Number(faker.commerce.price())}|`; // price
    oneRow += `${now}`; // date
    oneRow += '\n';

    counter++;
    return oneRow;
};

let loop = 49; // 10000000 - 1
const mainGenerator = async () => {
    if (loop % 1000 === 0) {
        process.stdout.write('.');
    }
    let ok = true;
    while (ok && loop > 0) {
        loop--;

        const categoryGen = () => {
            const randomNum = Math.floor(Math.random() * 10);
            return category[randomNum];
        };

        let product = categoryGen();

        const response = await axios(
            `https://api.unsplash.com/photos/random?query=${product}&w=550&h=550`,
            {
                headers: {
                    Authorization:
                        'Client-ID 0d5924256e9cfe3db0d32f26a201b6a5b78581ad90291841a444806e12e4dee8'
                }
            }
        );

        let photo550 = response.data.urls.custom;
        let photo400 = photo550.replace('w=550&h=550', 'w=400&h=400');
        let photo100 = photo550.replace('w=550&h=550', 'w=100&h=100');

        ok = await writeStream.write(
            sampleData(photo550, photo400, photo100, product),
            'utf-8'
        );
    }
    if (loop > 0) {
        writeStream.once('drain', mainGenerator);
    }

    if (loop === 0) {
        //last time
        const categoryGen = () => {
            const randomNum = Math.floor(Math.random() * 10);
            return category[randomNum];
        };

        let product = categoryGen();

        const response = await axios(
            `https://api.unsplash.com/photos/random?query=${product}&w=550&h=550`,
            {
                headers: {
                    Authorization:
                        'Client-ID 0d5924256e9cfe3db0d32f26a201b6a5b78581ad90291841a444806e12e4dee8'
                }
            }
        );

        let photo550 = response.data.urls.custom;
        let photo400 = photo550.replace('w=550&h=550', 'w=400&h=400');
        let photo100 = photo550.replace('w=550&h=550', 'w=100&h=100');

        await writeStream.write(
            sampleData(photo550, photo400, photo100, product),
            'utf-8'
        );
    }
};

process.stdout.write('processing.');
mainGenerator();

// \copy nordstroms from 'C:\web_hr\sdc\nordstrom-server-nav\seed-data\pg_copy.csv' with (format csv, delimiter '|');
//copy nordstroms from '/home/ubuntu/projects/seed_func/pg_copy.csv' with (format csv, delimiter '|');

const fs = require('fs');
const axios = require('axios');
const faker = require('faker');
const uuidv1 = require('uuid/v1');

const writeStream = fs.createWriteStream('./src/database/seed/seed_user.csv', {
    flags: 'a'
});

// cover1000
const defaultCover1000 = () => {
    const randomNum = Math.floor(Math.random() * 6 + 1);
    return `https://woojoo.s3-us-west-1.amazonaws.com/c${randomNum}.png`;
};

let counter = 41;

const sampleData = (photo550, photo400, photo100) => {
    let oneRow = '';
    let now = new Date();
    now.setHours(now.getHours() - counter);

    oneRow += `${counter}|`; // id
    oneRow += `${faker.name.firstName().toLowerCase()}@g.com|`; // email
    oneRow += `123|`; // password
    oneRow += `${uuidv1()}|`;
    oneRow += `${photo400}|`; // photo400
    oneRow += `${photo100}|`; // photo100
    oneRow += `${defaultCover1000()}|`; // cover1000

    oneRow += `${faker.name.firstName()}|`; // firstname
    oneRow += `${faker.name.lastName()}|`; // lastname
    oneRow += `${faker.phone.phoneNumberFormat()}|`; // phone
    oneRow += `${faker.internet.url()}|`; // web
    oneRow += ` |`; // info
    oneRow += `${now}`; // date
    oneRow += '\n';

    counter++;
    return oneRow;
};

let loop = 40; // 10000000 - 1
const mainGenerator = async () => {
    if (loop % 1000 === 0) {
        process.stdout.write('.');
    }
    let ok = true;
    while (ok && loop > 0) {
        loop--;

        const response = await axios(
            'https://api.unsplash.com/photos/random?query=portrait&w=550&h=550',
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
            sampleData(photo550, photo400, photo100),
            'utf-8'
        );
    }
    if (loop > 0) {
        writeStream.once('drain', mainGenerator);
    }

    if (loop === 0) {
        //last time
        const response = await axios(
            'https://api.unsplash.com/photos/random?query=portrait&w=550&h=550',
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
            sampleData(photo550, photo400, photo100),
            'utf-8'
        );
    }
};

process.stdout.write('processing.');
mainGenerator();

// \copy nordstroms from 'C:\web_hr\sdc\nordstrom-server-nav\seed-data\pg_copy.csv' with (format csv, delimiter '|');
//copy nordstroms from '/home/ubuntu/projects/seed_func/pg_copy.csv' with (format csv, delimiter '|');

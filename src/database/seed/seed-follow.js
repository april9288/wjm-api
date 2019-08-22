const fs = require('fs');

const writeStream = fs.createWriteStream(
    './src/database/seed/seed-follow.csv',
    {
        flags: 'a'
    }
);

let counter = 11;

const sampleData = follower => {
    const followedGen = () => {
        const temp = Math.floor(Math.random() * 80);
        return temp === follower ? temp + 1 : temp;
    };

    let oneRow = '';
    oneRow += `${counter}|`; // id
    oneRow += `${follower}|`; // follower
    oneRow += `${followedGen()}`; // followed
    oneRow += '\n';
    counter++;
    return oneRow;
};

let loop = 1000;

const mainGenerator = async () => {
    if (loop % 1000 === 0) {
        process.stdout.write('.');
    }
    let ok = true;
    while (ok && loop > 0) {
        loop--;

        const followerGen = () => {
            return Math.floor(Math.random() * 80);
        };
        const follower = followerGen();

        ok = await writeStream.write(sampleData(follower), 'utf-8');
    }
    if (loop > 0) {
        writeStream.once('drain', mainGenerator);
    }
    if (loop === 0) {
        // executed at the last time
        const followerGen = () => {
            return Math.floor(Math.random() * 80);
        };
        const follower = followerGen();

        await writeStream.write(sampleData(follower), 'utf-8');
    }
};

process.stdout.write('processing.');
mainGenerator();

// \copy nordstroms from 'C:\web_hr\sdc\nordstrom-server-nav\seed-data\pg_copy.csv' with (format csv, delimiter '|');
//copy nordstroms from '/home/ubuntu/projects/seed_func/pg_copy.csv' with (format csv, delimiter '|');

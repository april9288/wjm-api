const aws = require('aws-sdk');
const sharp = require('sharp');

const s3 = new aws.S3({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_S3_LOCATION
});

const uploadHelper = async (file, size) => {
    // handling empty file
    if (!file) {
        throw { message: 'empty file' };
    }

    // handling file format validation
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
        throw { message: 'file format' };
    }

    // resizing & converting file format to webp
    const resized = await sharp(file.buffer)
        .resize({ width: size, height: size })
        .webp()
        .toBuffer();

    // generating file name to upload
    const fileName = `${Date.now().toString()}.webp`;
    const location = `https://woojoouserphotos.s3-us-west-1.amazonaws.com/${fileName}`;

    if (process.env.NODE_ENV !== 'production') {
        // returning fake url for testing purpose
        return location;
    }

    try {
        // uploading file to AWS S3
        await s3
            .putObject({
                ACL: 'public-read',
                Body: resized,
                Bucket: 'woojoouserphotos',
                Key: fileName
            })
            .promise();
        return location;
    } catch (e) {
        throw e;
    }
};

module.exports = uploadHelper;

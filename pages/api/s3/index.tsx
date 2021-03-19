import AWS from 'aws-sdk';
import { NextApiHandler } from 'next'

AWS.config.update({ region: 'us-west-2' });
var credentials = new AWS.Credentials(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
AWS.config.credentials = credentials;

export const listObjects = async () => {
    return new Promise((resolve, reject) => {
        const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

        s3.listObjectsV2({ Bucket: 'website-happybirthday-images' }, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
}

export const getObject = async (key: string) => {
    return new Promise((resolve, reject) => {
        const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

        s3.getObject({ Bucket: 'website-happybirthday-images', Key: key }, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
}

const handler: NextApiHandler = async (req, res) => {
    try {
        const objects: any = await getObject(req.query?.key.toString());
        res.send(objects);
    } catch (e) {
        res.send(e);
    }
}

export default handler

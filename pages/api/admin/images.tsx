import AWS from 'aws-sdk';
import { NextApiHandler } from 'next'

AWS.config.update({ region: 'us-west-2' });
var credentials = new AWS.Credentials(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
AWS.config.credentials = credentials;

const handler: NextApiHandler = async (_req, res) => {
    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

    s3.listObjects({ Bucket: 'website-happybirthday-images' }, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
}

export default handler

import AWS from 'aws-sdk';
import { NextApiHandler } from 'next'

AWS.config.update({ region: 'us-west-2' });
var credentials = new AWS.Credentials(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
AWS.config.credentials = credentials;

let S3: AWS.S3 = undefined;

export const getS3 = (): AWS.S3 => {
    if (!S3) {
        S3 = new AWS.S3({ apiVersion: '2006-03-01' });
    }

    return S3;
}

export const getBucketName = () => {
    return 'website-happybirthday-images';
}
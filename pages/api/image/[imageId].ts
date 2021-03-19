import { NextApiHandler } from 'next'
import { query } from '@/lib/db'
import { getS3, getBucketName } from '@/lib/aws';

const getObject = (key: string, IfModifiedSince: Date, IfNoneMatch: string) => {
    return new Promise((resolve, reject) => {
        getS3().getObject({
            Bucket: getBucketName(),
            // IfNoneMatch: '"5c500a50bfb1c657e82dd4d825fcf0c6"',
            // TODO add cache control using ETag
            IfModifiedSince,
            // IfNoneMatch,
            Key: key
        }, function (err, data) {
            if (err) {
                if (err.statusCode === 304) {
                    resolve(err);
                    return;
                }
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

const handler: NextApiHandler = async (req, res) => {
    const { imageId } = req.query

    try {
        if (!imageId) {
            return res.status(404).json({ message: 'page not found' });
        }

        const results = await query(
            'select `id`, `key`, `objectURL` from hashcode inner join image on hashcode.image_id = image.id where hashcode=?',
            imageId.toString()
        )

        if (results && results[0]) {
            const key = results[0].key;
            const objectUrl = results[0].objectUrl;

            const data: any = await getObject(key, new Date(req.headers['if-modified-since']), req.headers['if-none-match']);

            if (data.statusCode === 304) {
                return res.status(304).send(data.code);
            }

            console.log(data.ETag)

            res.setHeader("Content-Type", data.ContentType);
            res.setHeader("Content-Length", data.ContentLength);
            // res.setHeader("ETag", data.ETag);
            res.setHeader("Last-Modified", data.LastModified);
            res.setHeader("Accept-Ranges", data.AcceptRanges);

            return res.send(data.Body)
        } else {
            return res.status(404).json({ message: 'page not found' });
        }
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export default handler

import { NextApiHandler, NextApiRequest } from 'next'
import { query } from '@/lib/db'

const get: NextApiHandler = async (req, res) => {
    const { key } = req.query

    try {
        if (!key) {
            return res.status(400).json({ message: '`key` required' })
        }

        const results: any = await query(
            'select `id`, `key`, `hashcode` from image left join hashcode on hashcode.image_id = image.id where `key`=?',
            key.toString()
        )

        if (results && results[0]) {
            const resJson = {
                id: results[0].id,
                key: results[0].key,
                hashcodes: results.map((r: any) => r.hashcode),
            }
            return res.json(resJson)
        } else {
            return res.status(404).json({ message: 'page not found' });
        }
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const post: NextApiHandler = async (req: NextApiRequest, res) => {
    const { key } = req.query
    const { hashcodes, objectUrl } = req.body;

    try {
        if (!key) {
            return res.status(400).json({ message: '`key` required' })
        }

        await query('LOCK TABLES image WRITE, hashcode WRITE');

        const results: any = await query(
            'select `id`, `key` from image where `key`=?',
            key.toString()
        )

        let imageId: any;
        if (results && results[0]) {
            imageId = results[0].id;
            await query(
                'update image set objectUrl=? where id=?',
                [objectUrl.toString(), imageId]
            );
        } else {
            const insertResult: any = await query(
                'insert into image (`key`, `objectUrl`) value (?, ?)',
                [ key.toString(), objectUrl.toString() ]
            );
            imageId = insertResult.insertId;
        }

        const values = hashcodes.map((h: any) => [h, imageId]);

        await query(
            'delete from hashcode where `image_id` = ?',
            imageId
        );

        const insertResult: any = await query(
            'insert into hashcode (`hashcode`, `image_id`) values ?',
            [values]
        );

        return res.json("ok")
    } catch (e) {
        res.status(500).json({ message: e.message })
    } finally {
        query('UNLOCK TABLES;');
    }
}

const handler: NextApiHandler = async (req, res) => {
    if (req.method === 'GET') {
        return get(req, res);
    } else if (req.method === 'POST') {
        return post(req, res);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' })
    }
}

export default handler

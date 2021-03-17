import { NextApiHandler } from 'next'
import { query } from '../../../lib/db'
import { useRouter } from 'next/router'

const handler: NextApiHandler = async (req, res) => {
    const { imageId } = req.query

    try {
        if (!imageId) {
            return res.status(400).json({ message: '`imageId` required' })
        }

        if (typeof parseInt(imageId.toString()) === 'number') {
            const results = await query(
                'SELECT `id`, `key`, `s3Url`, `arn`, `Etag`, `objectURL`, `size`, `type` FROM `image` WHERE id = ?',
                imageId
            )

            return res.json(results[0])
        } else {
            return res.status(400).json({ message: '`id` must be a number' })
        }
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export default handler

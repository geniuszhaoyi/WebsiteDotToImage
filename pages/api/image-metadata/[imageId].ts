import { NextApiHandler } from 'next'
import { query } from '../../../lib/db'
import { useRouter } from 'next/router'

const handler: NextApiHandler = async (req, res) => {
    const { imageId } = req.query

    try {
        if (!imageId) {
            return res.status(400).json({ message: '`imageId` required' })
        }

        const results = await query(
            'select `id`, `key`, `s3Url`, `arn`, `Etag`, `objectURL`, `size`, `type` from hashcode inner join image on hashcode.image_id = image.id where hashcode=?',
            imageId.toString()
        )

        if (results && results[0]) {
            return res.json(results[0])
        } else {
            return res.status(404).json({message: 'page not found'});
        }
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export default handler

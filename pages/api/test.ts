import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
    res.setHeader("ETag", "5cja7f7wbfb1c657e82dd4ssfj8sf0c6");
    return res.send("Some data here");
}

export default handler;
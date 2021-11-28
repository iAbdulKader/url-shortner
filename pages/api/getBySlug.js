import nextConnect from 'next-connect';
import middleware from '../../lib/middlewares/middleware';
import dbConnect from '../../lib/database/dbConnect';
import Url from '../../lib/database/model/Url';

dbConnect()

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res) => {
  let slug = req.body.slug
  
  try {
    const url = await Url.findOne({ slug });

    if (url) {
      res.status(200).json(url);
    }
    else{
      res.status(404).json({
        success: false,
        message: 'Not Found'
      });
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({
      success: false
    })
  }
})

export default handler;
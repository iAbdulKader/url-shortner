import nextConnect from 'next-connect';
import { nanoid } from 'nanoid';
import middleware from '../../lib/middlewares/middleware';
import dbConnect from '../../lib/database/dbConnect';
import Url from '../../lib/database/model/Url';
import schema from '../../lib/database/schema';

const handler = nextConnect();

dbConnect()
handler.use(middleware);


handler.post(async (req, res) => {
  let url = req.body.url;
  let slug = req.body.slug;
 
  try {
      await schema.validate({
          url
        })
      if (slug) {
        await schema.validate({
          slug,
          url
        });
      }
      if (!slug || slug == undefined) {
        slug = nanoid(6);
      } else {
        const existing = await Url.findOne({ slug });
        console.log(existing)
        if (existing) {
         return res.status(201).json({
            success: false,
            shortUrl: "Slug Already In Use"
          })
        }
      }
      
      slug = slug.toLowerCase();
      const shortUrl = `${process.env.HOST_URL}/${slug}`
      const newUrl = new Url({
        slug,
        url,
        shortUrl
      });
      const response = await newUrl.save();
      // Send json response
      console.log("res", response)
      res.status(200).json(response);
      
  } catch (e) {
    console.log(e.message)
    res.status(500).json({
      success: false,
      message: e.message
    })
  }
})

export default handler;
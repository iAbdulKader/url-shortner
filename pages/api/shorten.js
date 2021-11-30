import nextConnect from 'next-connect';
import { nanoid } from 'nanoid';
import middleware from '../../lib/middlewares/middleware';
import dbConnect from '../../lib/database/dbConnect';
import Url from '../../lib/database/model/Url';
import schema from '../../lib/database/schema';

dbConnect()

const handler = nextConnect();
handler.use(middleware);


handler.post(async (req, res) => {
  let url = req.body.url.trim();
  let slug = req.body.slug.trim();
 
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
        const response = await postUrl(slug, url);
          // Send json response
        res.status(200).json(response);
      } else {
        slug = slug.toLowerCase();
        const existing = await Url.findOne({ slug: slug });
        if (existing) {
         return res.status(201).json({
            success: false,
            shortUrl: "Slug Already In Use"
          })
        } else {
          const response = await postUrl(slug, url);
          // Send json response
          res.status(200).json(response);
        }
      }
  } catch (e) {
    console.log(e.message)
    res.status(500).json({
      success: false,
      message: e.message
    })
  }
})

export async function postUrl(slug, url){
    slug = slug.toLowerCase();
    const shortUrl = `${process.env.HOST_URL}/${slug}`
    const newUrl = new Url({
      slug,
      url,
      shortUrl
    })
    const response = await newUrl.save();
    return response;
}
export default handler;
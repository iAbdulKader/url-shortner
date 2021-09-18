const { nanoid } = require("nanoid");
const schema = require("../Model/schema");
const { urls } = require("../Model/database");
const bodyParser = require("body-parser");
require("dotenv").config();


const postUrlRoute = async (req, res, next) => {
  let { url, slug } = req.body;
  console.log(slug, url)
  try {
    if (slug == "") {
        await schema.validate({
        url,
      });
      } else {
        await schema.validate({
          slug,
          url,
        });
      }
      if (!slug) {
        slug = nanoid(6);
      }
      else{
        const existing = await urls.findOne({ slug });
        if (existing) {
          //throw new Error("Slug in use.")
          res.end("Slug already in use")
        }
      }
      
      slug = slug.toLowerCase();
      const newUrl ={
        slug,
        url,
      };
      const created = await urls.insert(newUrl);
      console.log(created);
      let createdSlug = created.slug;
      const shortUrl = `${process.env.HOST_URL}/${createdSlug}`
      //  Send response to frontend
      res.end(shortUrl);
      // Send json response
       //res.json(created);
        
    } catch (error) {
      res.end("Invalid Url");
      next(error);
    }
}

module.exports = postUrlRoute;
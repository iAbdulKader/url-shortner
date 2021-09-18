const { nanoid } = require("nanoid");
const schema = require("../Model/schema");
const { urls } = require("../Model/database");
require("dotenv").config();

const postUrlRoute = async (req, res, next) => {
  let { slug, url } = req.body;
  // let slug= req.body.slug;
 //  let url = req.body.url;
  try {
    if (slug == "") {
        await schema.validate({
        //slug,
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
      let createdSlug = created.slug;
      const shortUrl = `${process.env.HOST_URL}/${createdSlug}`
      //  Send response to frontend
      res.end(shortUrl);
           
  
        //res.json(created);
        //res.render('home', { result });
        
    } catch (error) {
      res.end("Invalid Url");
      next(error);
    }
}

module.exports = postUrlRoute;
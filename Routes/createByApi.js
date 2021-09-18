const { nanoid } = require("nanoid");
const schema = require("../Model/schema");
const { urls, api_keys } = require("../Model/database");

const createByApi = async (req, res) => {
  let api_key = req.query.api_key;
  let url = req.query.u;
  let isEncoded = req.query.encoded;
  
  const isApiKey = await api_keys.findOne({ api_key });
  
  if(isEncoded === "true"){
    urldecoded = Buffer.from(url, 'base64').toString();
    try {
    await schema.validate({ url: urldecoded });
    if (isApiKey) {
  
      let slug = nanoid(6).toLowerCase();
      const newUrl ={
        slug,
        url: urldecoded,
      };
      const created = await urls.insert(newUrl);
      let createdSlug = created.slug;
      
      res.json({
        shortUrl: `${process.env.HOST_URL}/${createdSlug}`,
        url: urldecoded
      })
    }
    else{
      res.json({
        api_key: "invalid api key"
      })
    }
  } catch (e) {
    res.json({
      error: "invalid link and api"
    })
  }
    
  }
  
 else{
   
   try {
    await schema.validate({ url });
    if (isApiKey) {
  
      let slug = nanoid(6).toLowerCase();
      const newUrl ={
        slug,
        url,
      };
      const created = await urls.insert(newUrl);
      let createdSlug = created.slug;
      
      res.json({
        shortUrl: `${process.env.HOST_URL}/${createdSlug}`,
        url: url
      })
    }
    else{
      res.json({
        api_key: "invalid api key"
      })
    }
  } catch (e) {
    res.json({
      error: "invalid link"
    })
  }
   
 }
  
};

module.exports = createByApi;
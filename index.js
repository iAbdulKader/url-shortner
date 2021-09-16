const express = require("express");
const path = require('path');
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const yup = require("yup");
const { nanoid } = require("nanoid");
const monk = require("monk");
const bodyParser = require("body-parser");
const router = express.Router();
require("dotenv").config();

// Database Handling 
const db = monk(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const urls = db.get('urls');
const api_keys = db.get('api_keys');
urls.createIndex({ slug: 1 }, { unique: true });
api_keys.createIndex({ api_key: 1 }, { unique: true });

// App function 
const app = express();
app.use(express.static('public'));


// make way for js and css files
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));

// Middlewares
app.use(helmet());
app.use(morgan('short'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/",router);


// Schema Validation
const schema = yup.object().shape({
  slug: yup.string().matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
})


router.get("/api", (req,res) => {
  //res.sendFile(path.join(__dirname, './public', 'keygenerate.html'));
 //res.render("apiKeyGen")
 res.redirect("/api.html")
 
})
// Routes

// API request
router.post("/create", async (req, res) => {
  let api_key = req.query.api_key;
  let url = req.query.u;
  
  const isApiKey = await api_keys.findOne({ api_key });
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
})

// api key generator
router.post("/apiGen", async (req, res) => {
  try {
    const api_key = nanoid(16);
  
    const apiKey = {
      api_key
    };
    const createdApiKey = await api_keys.insert(apiKey);
  
    const createdApi = createdApiKey.api_key;
  
    res.end(createdApi);
  } catch (e) {
    res.end("Try Again")
  }
})
  

// Get Link by ID route
router.get('/:id', async (req, res, next) => {
  const { id: slug } = req.params;
  try {
    const url = await urls.findOne({ slug });
    if (url) {
      res.redirect(url.url);
    }
    //res.redirect(`/?error=${slug} Not found`);
    res.sendFile(path.join(__dirname, './public', 'notfound.html'));
  } catch (error) {
    //res.redirect(`/?error=Link not found`)
    res.sendFile(path.join(__dirname, './public', 'notfound.html'));
  }
});




// POST Route
router.post('/url', async (req, res, next) => {
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
      res.end("");
      next(error);
    }
});


// Error Handling 
app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status)
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? 'Yo' : error.stack,
  });
});




// Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening at https://localhost/${port}`)
});


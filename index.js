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
const db = monk(process.env.MONGODB_URI);
const urls = db.get('urls');
urls.createIndex({ slug: 1 }, { unique: true });

// App function 
const app = express();
app.use(express.static('./public'));

// Middlewares
app.use(helmet());
app.use(morgan('short'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/",router);


// Routes
//Home Route
router.get('/yo', (req, res) => {
 res.render("home");
});

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


// Schema Validation
const schema = yup.object().shape({
  slug: yup.string().matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
})

// POST Route
router.post('/url', async (req, res, next) => {
  //let { slug, url } = req.body;
   let slug= req.body.slug.trim();
   let url = req.body.url;
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
        
      //  Send response to frontend
      res.end(createdSlug);
           
  
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


const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const yup = require("yup");
const { nanoid } = require("nanoid");
const monk = require("monk");
const bodyParser = require("body-parser");
require("dotenv").config();

const db = monk(process.env.MONGODB_URI);
const urls = db.get('urls');
urls.createIndex({ slug: 1 }, { unique: true });



const app = express();
app.set("view engine", "ejs");
app.use(express.static('./public'));

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
 res.render("home");
});

app.get('/:id', async (req, res, next) => {
  const { id: slug } = req.params;
  try {
    const url = await urls.findOne({ slug });
    if (url) {
      res.redirect(url.url);
    }
    res.redirect(`/?error=${slug} Not found`);
  } catch (error) {
    res.redirect(`/?error=Link not found`)
  }
});



const schema = yup.object().shape({
  slug: yup.string().matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
})
app.post('/url', async (req, res, next) => {
  let { slug, url } = req.body;
 // let slug= req.body.slug.trim();
 // let url = req.body.url;
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
    slug = nanoid(5);
  }
  else{
    const existing = await urls.findOne({ slug });
    if (existing) {
      throw new Error("Slug in use.")
    }
  }
  slug = slug.toLowerCase();
  const newUrl ={
    slug,
    url,
  };
  const created = await urls.insert(newUrl);
  //console.log(created.slug)
 // const result = `http://localhost:3000/${created.slug}`;
  
  res.json(created);
  //res.render('home', { result })
  } catch (error) {
    next(error);
  }
});

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
})



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening at https://localhost/${port}`)
});


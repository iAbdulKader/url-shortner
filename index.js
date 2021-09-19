const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { nanoid } = require("nanoid");
const { wakeDyno } = require('heroku-keep-awake');
require("dotenv").config();

// Routes import
const apiRoute = require("./Routes/apiRoute");
const createByApi = require("./Routes/createByApi");
const apiKeyGen = require("./Routes/apiKeyGen");
const getBySlug = require("./Routes/getBySlug");
const postUrlRoute = require("./Routes/postUrlRoute");
const errorHandling = require("./Routes/errorHandling");

// Heroku Dyno Alive
const DYNO_URL = process.env.HOST_URL;
const opts = {
    interval: 25,
    logging: false,
    stopTimes: { start: '18:50', end: '02:00' }
};

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
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/api", apiRoute)
// API request
app.get("/create", createByApi)
// api key generator
app.post("/apiKeyGen", apiKeyGen);
// Get Link by ID = slug route
app.get('/:id', getBySlug);
// POST Route
app.post('/url', postUrlRoute);


// Error Handling 
app.use(errorHandling);

// Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  wakeDyno(DYNO_URL, opts);
  console.log(`Listening at https://localhost/${port}`);
});
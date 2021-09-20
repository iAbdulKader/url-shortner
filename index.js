const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { nanoid } = require("nanoid");
const path = require("path");
const { wakeDyno } = require('heroku-keep-awake');
require("dotenv").config();


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

// view engine set up
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Middlewares
app.use(morgan('short'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// HOME 
app.use("/", require("./Routes/homeRoute"));
// API route
app.use("/api", require("./Routes/apiRoute"));
// API request
app.use("/create", require("./Routes/createByApi"));
// api key generator
app.use("/apiKeyGen", require("./Routes/apiKeyGen"));
// POST Route
app.use('/url', require("./Routes/postUrlRoute"));
// Get Link by ID = slug route
app.use('', require("./Routes/getBySlug"));


// Error Handling 
const errorHandling = require("./Routes/errorHandling");
app.use(errorHandling);

// Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  wakeDyno(DYNO_URL, opts);
  console.log(`Listening at https://localhost/${port}`);
});
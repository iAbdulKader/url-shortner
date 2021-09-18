const monk = require("monk");
require("dotenv").config();

const db = monk(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const urls = db.get('urls');
const api_keys = db.get('api_keys');

urls.createIndex({ slug: 1 }, { unique: true });
api_keys.createIndex({ api_key: 1 }, { unique: true });

module.exports = {
  urls,
  api_keys
  };
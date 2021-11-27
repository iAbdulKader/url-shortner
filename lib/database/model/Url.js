const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UrlSchema = new Schema({
  slug: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true
 },
  shortUrl: {
   type: String,
   required: true
 }
}, { timestamps: true });

//UrlSchema.index( { "slug": 1 }, { unique: true } );

module.exports = mongoose.models.Url || mongoose.model('Url', UrlSchema);
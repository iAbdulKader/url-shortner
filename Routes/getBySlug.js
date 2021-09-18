const { urls } = require("../Model/database");
const path = require('path');

const getBySlug = async (req, res, next) => {
  const { id: slug } = req.params;
  try {
    const url = await urls.findOne({ slug });
    if (url) {
      res.redirect(url.url);
    }
    //res.redirect(`/?error=${slug} Not found`);
    res.sendFile(path.join(__dirname, '../public', 'notfound.html'));
  } catch (error) {
    //res.redirect(`/?error=Link not found`)
    res.sendFile(path.join(__dirname, '../public', 'notfound.html'));
  }
};

module.exports = getBySlug;
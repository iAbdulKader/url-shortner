const { urls } = require("../Model/database");
const router = require("express").Router();


router.get("/:id", async (req, res, next) => {
  const { id: slug } = req.params;
  try {
    const url = await urls.findOne({ slug });
    if (url) {
      return res.redirect(url.url);
    }
    //res.redirect(`/?error=${slug} Not found`);
    else{
      
    res.render("notfound");
    }
  } catch (error) {
    //res.redirect(`/?error=Link not found`)
    res.render("notfound");
  }
});

module.exports = router;
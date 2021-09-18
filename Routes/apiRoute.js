const apiRoute = (req,res) => {
  //res.sendFile(path.join(__dirname, './public', 'keygenerate.html'));
 //res.render("apiKeyGen")
 res.redirect("/api.html")}
 
 module.exports = apiRoute;
module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.render("error/403.ejs", { layout: false });
  }
};

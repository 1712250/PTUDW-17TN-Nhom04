const router = require("express").Router();
const checkout = require("./checkout");
const account = require("./account");

router.get("/", (req, res, next) => {
	res.render("homepage", { title: "Obooks" });
});

router.get("/browse", (req, res, next) => {
	res.render("browse_books", { title: "Browse" });
});

router.get("/browse/book", (req, res, next) => {
	res.render("book_detail", { title: "Book Detail" });
});

router.use("/checkout", checkout);
router.use("/account", account);

module.exports = router;

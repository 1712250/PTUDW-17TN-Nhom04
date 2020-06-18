const router = require("express").Router();
const checkout = require("./checkout");

router.get("/", (req, res, next) => {
	res.render("homepage", { title: "Obooks" });
});

router.get("/account", (req, res, next) => {
	res.render("account_info", { title: "Account" });
});

router.get("/account/books", (req, res, next) => {
	res.render("book_you_buy", { title: "Your Books" });
});

router.get("/account/orders", (req, res, next) => {
	res.render("orders", { title: "Your Orders" });
});

router.get("/browse", (req, res, next) => {
	res.render("browse_books", { title: "Browse" });
});

router.get("/browse/book", (req, res, next) => {
	res.render("book_detail", { title: "Book Detail" });
});

router.use("/checkout", checkout);

module.exports = router;

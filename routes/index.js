const router = require("express").Router();

router.get("/", (req, res, next) => {
	res.render("homepage", { title: "Obooks" });
});

router.get("/account", (req, res, next) => {
	res.render("account_info", { title: "Account" });
});

router.get("/account/books", (req, res, next) => {
	res.render("book_you_buy", { title: "Your books" });
});

router.get("/account/cart", (req, res, next) => {
	res.render("your_cart", { title: "Your cart" });
});

router.get("/browse", (req, res, next) => {
	res.render("browse_books", { title: "Browse" });
});

router.get("/browse/book", (req, res, next) => {
	res.render("book_detail", { title: "Book detail" });
});

router.get("/cart", (req, res, next) => {
	res.render("your_cart", { title: "Your Cart" });
});

router.get("/account/orders", (req, res, next) => {
	res.render("orders", { title: "Orders" });
});

module.exports = router;

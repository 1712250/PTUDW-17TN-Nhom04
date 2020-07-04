const router = require("express").Router();
const { isAuthenticated } = require("../utils/authmiddleware");

router.use(isAuthenticated);

router.get("/cart", (req, res, next) => {
	req.user.populate(
		{ path: "cart", populate: { path: "book", populate: "author" } },
		(err, user) => {
			let cart = [];
			if (err) {
				console.log("Error while populate user");
			} else {
				cart = user.cart;
			}
			res.render("checkout/cart", { title: "Cart", cart: cart });
		}
	);
});

router.get("/shipping", (req, res, next) => {
	res.render("checkout/shipping", { title: "Shipping" });
});

router.get("/payment", (req, res, next) => {
	res.render("checkout/payment", { title: "Payment" });
});
module.exports = router;

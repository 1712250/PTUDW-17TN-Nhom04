const router = require("express").Router();

router.get("/cart", (req, res, next) => {
	res.render("checkout/cart", { title: "Cart" });
});

router.get("/shipping", (req, res, next) => {
	res.render("checkout/shipping", { title: "Shipping" });
});

router.get("/payment", (req, res, next) => {
	res.render("checkout/payment", { title: "Payment" });
});
module.exports = router;

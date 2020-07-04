const router = require("express").Router();
const checkout = require("./checkout");
const account = require("./account");
const browse = require("./browse");

router.get("/", (req, res, next) => {
	res.render("homepage", { title: "Obooks" });
});

router.use("/browse", browse);
router.use("/checkout", checkout);
router.use("/account", account);

module.exports = router;

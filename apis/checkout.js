const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../utils/authmiddleware");

router.use(isAuthenticated);
router.post("/cart/add", (req, res) => {
	const added = JSON.stringify(req.user.cart.addToSet(req.body.bookId)[0]);
	const bookId = JSON.stringify(req.body.bookId);
	if (added === bookId) {
		req.user.save().then((user) => {
			res.status(200).send("OK");
		});
	} else {
		res.status(409).send("Already added");
	}
});

router.post("/cart/remove", (req, res) => {
	console.log(req);
	req.user.cart.pull(req.body.bookId);
	req.user.save().then((user) => {
		res.status(200).send("OK");
	});
});

module.exports = router;

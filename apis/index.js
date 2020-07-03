const router = require("express").Router();
const passport = require("passport");
const UserController = require("../controllers/UserController");

router.post("/login", passport.authenticate("local"), (req, res) => {
	res.status(200).send("OK");
});

router.post("/signup", UserController.signUp);

router.post("/logout", (req, res) => {
	req.logout();
	res.status(200).send("OK");
});

module.exports = router;

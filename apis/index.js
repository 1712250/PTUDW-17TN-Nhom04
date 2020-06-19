const router = require("express").Router();

router.post("/login", (req, res, next) => {
	res.cookie("auth_string", "12345678");
	res.send({ message: "success" });
});

module.exports = router;

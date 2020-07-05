const router = require("express").Router();
const passport = require("passport");

const UserController = require("../controllers/UserController");
const TempUserController = require("../controllers/TempUserController");
const MailController = require("../utils/MailController");

const { genPassword, randomPassword } = require("../utils/hashing");
const { isAuthenticated } = require("../utils/authmiddleware");

router.post("/login", passport.authenticate("local"), (req, res) => {
	res.status(200).send("OK");
});

router.post("/forgetpassword", (req, res) => {
	UserController.getUser(req.body.email).then((user) => {
		const randPass = randomPassword();
		user.password = genPassword(randPass);
		user.save()
			.then((user) => {
				MailController.sendResetPassword(randPass, user);
				res.status(200).send({
					status: 200,
					message: "Sent",
				});
			})
			.catch((err) =>
				res.status(500).send({ status: 500, message: "Server is busy" })
			);
	});
});

router.post("/signup", (req, res) => {
	const user_info = req.body;
	user_info.password = genPassword(user_info.password);
	UserController.getUser(user_info.email).then((user) => {
		if (user) {
			res.status(409).send({
				status: 409,
				message: "Email is already existed",
			});
		} else {
			TempUserController.getTempUser(user_info.email)
				.then((tempUser) => {
					if (tempUser) {
						res.status(409).send({
							status: 409,
							message: "Email is already existed",
						});
					} else {
						TempUserController.createTempUser(user_info)
							.then((tempUser) => {
								MailController.sendActivation(tempUser);
								res.status(200).send({
									status: 200,
									message: "Sign up successfully",
								});
							})
							.catch((err) => {
								res.status(500).send({
									status: 500,
									message: "Server is busy",
								});
							});
					}
				})
				.catch((err) => {
					res.status(500).send({
						status: 500,
						message: "Server is busy",
					});
				});
		}
	});
});

router.post("/logout", isAuthenticated, (req, res) => {
	req.logout();
	res.status(200).send("OK");
});

module.exports = router;

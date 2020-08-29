const router = require("express").Router();

const TempUserController = require("../controllers/TempUserController");
const UserController = require("../controllers/UserController");

const { isAuthenticated } = require("../utils/authmiddleware");

router.get("/", isAuthenticated, (req, res) => {
	res.render("account/account_info", { title: "Your Account" });
});

router.get("/orders", isAuthenticated, async (req, res, next) => {
	await req.user.populate({path: 'orders.books.book', populate: 'book'}).execPopulate();
	res.render("account/orders", { title: "Your Orders", orders: req.user.orders });
});

router.get("/books", isAuthenticated, async (req, res, next) => {
	await req.user.populate({path: 'orders.books.book', populate: 'book'}).execPopulate();
	res.render("account/book_you_buy", { title: "Your Books", orders: req.user.orders });
});

router.get("/activation/:userId", (req, res) => {
	if (req.isAuthenticated()) {
		return sendActivationResponse(res, "logout");
	}
	TempUserController.getTempUserById(req.params.userId).then((tempUser) => {
		if (!tempUser) {
			return sendActivationResponse(res, "expired");
		}
		UserController.createUser(tempUser)
			.then((user) => {
				TempUserController.deleteTempUser(req.params.userId).then(() =>
					req.login(user, () => {
						res.locals.user = user;
						sendActivationResponse(res, "success");
					})
				);
			})
			.catch((err) => {
				sendActivationResponse(res, "busy");
			});
	});
});

function sendActivationResponse(res, type) {
	if (type === "success") {
		res.render("activation", {
			title: "Activation",
			message: "Your account has been activated successfully.",
		});
	} else if (type === "busy") {
		res.render("activation", {
			title: "Activation",
			message: "Server is busy.",
		});
	} else if (type === "expired") {
		res.render("activation", {
			title: "Activation",
			message: "Your activation code is expired, please sign up again.",
		});
	} else if (type === "logout") {
		res.render("activation", {
			title: "Activation",
			message: "Please log out first.",
		});
	}
}

module.exports = router;

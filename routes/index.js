const router = require("express").Router();
const checkout = require("./checkout");
const account = require("./account");
const browse = require("./browse");

const { getBookInstances } = require("../controllers/BookInstanceController");

router.get("/", async (req, res, next) => {
	const bestSell = await getBookInstances({
		page: 1,
		category: "Fiction",
		sortBy: "Best sell",
	});
	const newBooks = await getBookInstances({ page: 1, sortBy: "New" });
	const vietnamese = await getBookInstances({
		page: 1,
		language: ["Vietnamese"],
		sortBy: "Best sell",
	});
	const mystery = await getBookInstances({
		page: 1,
		genre: "Crime, Thrillers and Mystery",
	});

	res.render("homepage", {
		title: "Obooks",
		bestSell,
		newBooks,
		vietnamese,
		mystery,
	});
});

router.use("/browse", browse);
router.use("/checkout", checkout);
router.use("/account", account);

module.exports = router;

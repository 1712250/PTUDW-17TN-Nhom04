const router = require("express").Router();
const { getGenre } = require("../controllers/GenreController");
const { getBookInstances } = require("../controllers/BookInstanceController");

router.get("/", async (req, res, next) => {
	const queries = parseURL(req._parsedOriginalUrl.query);
	console.log(queries);
	const genres = await getGenre(queries.category);
	const bookInstances = await getBookInstances(queries);

	console.log(bookInstances);
	res.render("browse_books", {
		title: "Browse",
		genres: genres,
		selectedGenre: queries.genre,
		bookInstances: bookInstances,
	});
});

router.get("/book", (req, res, next) => {
	res.render("book_detail", { title: "Book Detail" });
});

module.exports = router;

function parseURL(urlQuery) {
	if (!urlQuery) return { page: 1 };

	const queries = { page: 1 };
	urlQuery
		.split("&")
		.map((u) => u.split("="))
		.forEach(([key, value]) => {
			value = value.replace(/-/g, " ").replace(/(^\w)/, function (v) {
				return v.toUpperCase();
			});
			if (key) {
				if (key.endsWith("[]")) {
					key = key.slice(0, -2);
					if (!queries[key]) queries[key] = [];
					queries[key].push(value);
				} else queries[key] = value;
			}
		});
	return queries;
}

const router = require("express").Router();
const { getGenre } = require("../controllers/GenreController");
const { getBookInstances } = require("../controllers/BookInstanceController");

router.get("/", async (req, res, next) => {
	const queries = parseURL(req._parsedOriginalUrl.query);
	const genres = await getGenre(queries.category);
	const { bookInstances, totalPages } = await getBookInstances(queries);

	let selectedPage = parseInt(queries.page);
	const renderedPages = [];

	if (selectedPage < 1) selectedPage = 1;
	else if (selectedPage > totalPages) selectedPage = totalPages;

	if (selectedPage == 1) {
		renderedPages.push(1);
		if (totalPages > 1) renderedPages.push(2);
		if (totalPages > 2) renderedPages.push(3);
	} else if (selectedPage == totalPages) {
		if (totalPages > 2) renderedPages.push(totalPages - 2);
		if (totalPages > 1) renderedPages.push(totalPages - 1);
		renderedPages.push(totalPages);
	} else {
		renderedPages = [selectedPage - 1, selectedPage, selectedPage + 1];
	}

	res.render("browse_books", {
		title: "Browse",
		genres: genres,
		selectedGenre: queries.genre,
		bookInstances: bookInstances,
		renderedPages: renderedPages,
		selectedPage: selectedPage,
		totalPages: totalPages,
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

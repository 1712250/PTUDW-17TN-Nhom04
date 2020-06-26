const Model = require("../models/BookInstance");
require("../models/Book");
require("../models/Author");

module.exports.getBookInstances = async ({
	page,
	sortBy,
	category,
	genre,
	rating,
	condition,
	language,
}) => {
	const queries = {};
	if (condition) queries.status = { $in: condition };
	if (language) queries.language = { $in: language };

	const subQueries = {};
	if (genre) subQueries.genre = genre;
	if (rating) subQueries.rating = parseInt(rating.slice(0, 1));

	try {
		const query = Model.find(queries).populate({
			path: "book",
			populate: [{ path: "author" }, { path: "genres" }],
		});
		if (sortBy === "New") {
			query.sort("added_date");
		} else if (sortBy === "Best sell") {
			query.sort("-sold");
		} else if (sortBy === "High discount") {
			query.sort("-discount");
		} else if (sortBy === "Price descending") {
			query.sort("-price");
		} else if (sortBy === "Price ascending") {
			query.sort("price");
		}

		let bookInstances = [];
		let pages = 0;

		if (subQueries.genre || subQueries.rating) {
			bookInstances = (await query.exec()).filter((doc) =>
				isValid(doc, subQueries)
			);
			pages = bookInstances.length;
			bookInstances = bookInstances.splice((page - 1) * 20, 20);
		} else {
			bookInstances = await query
				.skip((page - 1) * 20)
				.limit(20)
				.exec();
			pages = Math.ceil((await query.countDocuments()) / 20);
		}
		return {
			bookInstances,
			pages,
		};
	} catch (err) {
		console.log(
			"Error while retrieving book instances! Error: " + err.message
		);
		return { bookInstances: [], pages: 0 };
	}
};

function isValid(bookInstance, queries) {
	if (queries.genre) {
		let containsGenre = false;
		for (let i = 0; i < bookInstance.book.genres.length; i++) {
			if (bookInstance.book.genres[i].name === queries.genre) {
				containsGenre = true;
				break;
			}
		}
		if (!containsGenre) return false;
	}
	if (queries.rating && bookInstance.book.rating < queries.rating)
		return false;
	return true;
}

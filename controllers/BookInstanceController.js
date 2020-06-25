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
		const query = Model.find(queries)
			.skip((page - 1) * 20)
			.limit(20)
			.populate({
				path: "book",
				populate: { path: "author" },
			})
			.populate({
				path: "book",
				populate: { path: "genre" },
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
		return await query.exec();
	} catch (err) {
		console.log(
			"Error while retrieving book instances! Error: " + err.message
		);
		return [];
	}
};

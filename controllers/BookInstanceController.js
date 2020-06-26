const Model = require("../models/BookInstance");
const BookModel = require("../models/Book");
const GenreModel = require("../models/Genre");
const AuthorModel = require("../models/Author");

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
	minPrice,
	maxPrice,
}) => {
	const queries = {};
	if (condition) queries.status = { $in: condition };
	if (language) queries.language = { $in: language };

	const sortQuery = {};
	if (sortBy === "New") {
		sortQuery.added_date = 1;
	} else if (sortBy === "Best sell") {
		sortQuery.sold = -1;
	} else if (sortBy === "High discount") {
		sortQuery.discount = -1;
	} else if (sortBy === "Price descending") {
		sortQuery.price = -1;
	} else if (sortBy === "Price ascending") {
		sortQuery.price = 1;
	}

	try {
		const aggregate = Model.aggregate([
			{
				$lookup: {
					from: BookModel.collection.name,
					localField: "book",
					foreignField: "_id",
					as: "book",
				},
			},
			{ $unwind: "$book" },
			{
				$lookup: {
					from: AuthorModel.collection.name,
					localField: "book.author",
					foreignField: "_id",
					as: "book.author",
				},
			},
			{
				$lookup: {
					from: GenreModel.collection.name,
					localField: "book.genres",
					foreignField: "_id",
					as: "book.genres",
				},
			},
		]);

		if (Object.keys(sortQuery).length > 0) {
			aggregate.sort(sortQuery);
		}
		if (rating) {
			aggregate.match({
				"book.rating": { $gte: parseInt(rating.slice(0, 1)) },
			});
		}
		if (category) {
			aggregate.match({
				"book.genres": { $elemMatch: { category: category } },
			});
		}
		if (genre) {
			aggregate.match({
				"book.genres": await GenreModel.findOne({ name: genre }).exec(),
			});
		}
		if (minPrice) {
			aggregate.match({
				price: { $gte: parseInt(minPrice) },
			});
		}
		if (maxPrice) {
			aggregate.match({
				price: { $lte: parseInt(maxPrice) },
			});
		}
		const docs = await aggregate
			.skip((page - 1) * 20)
			.limit(20)
			.exec();
		return { bookInstances: docs, pages: 0 };
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

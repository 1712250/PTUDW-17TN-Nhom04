const Model = require("../models/BookInstance");
const BookModel = require("../models/Book");
const GenreModel = require("../models/Genre");
const AuthorModel = require("../models/Author");

require("../models/Book");
require("../models/Author");

module.exports.getBookInstances = async (queries) => {
	try {
		const totalDocuments = (
			await buildQuery(queries).count("totalDocuments").exec()
		)[0].totalDocuments;
		const totalPages = Math.ceil(totalDocuments / 20);
		const limit = Math.min(totalDocuments - (queries.page - 1) * 20, 20);

		return {
			bookInstances: await buildQuery(queries)
				.skip((queries.page - 1) * 20)
				.limit(limit)
				.exec(),
			totalPages: totalPages,
		};
	} catch (err) {
		console.log(
			"Error while retrieving book instances! Error: " + err.message
		);
		return { bookInstances: [], pages: 0 };
	}
};

function buildQuery({
	sortBy,
	category,
	genre,
	rating,
	condition,
	language,
	minPrice,
	maxPrice,
	search,
}) {
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
	if (genre && genre != "All genres") {
		aggregate.match({
			"book.genres": { $elemMatch: { name: genre } },
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
	if (condition) {
		aggregate.match({
			status: { $in: condition },
		});
	}
	if (language) {
		aggregate.match({
			language: { $in: language },
		});
	}
	if (search) {
		aggregate.match({
			"book.title": { $regex: new RegExp(search), $options: "i" },
		});
	}
	return aggregate;
}

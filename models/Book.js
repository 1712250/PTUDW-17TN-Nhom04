const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		default: "No description available",
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Author",
	},
	rating: {
		type: Number,
	},
	genres: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Genre",
		},
	],
	image_url: {
		type: String,
		default: "/images/cover_not_available.png",
	},
});

module.exports = mongoose.model("Book", bookSchema);

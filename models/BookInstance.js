const mongoose = require("mongoose");
const bookInstanceSchema = new mongoose.Schema({
	book: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Book",
		require: true,
	},
	language: {
		type: String,
		enum: ["Vietnamese", "German", "English", "Chinese"],
	},
	status: {
		type: String,
		enum: [
			"New",
			"Like new",
			"Very good",
			"Good",
			"Acceptable",
			"A bit old",
		],
	},
	price: {
		type: Number,
		default: 0,
	},
	discount: {
		type: Number,
		default: 0,
	},
	count: {
		type: Number,
		default: 0,
	},
	sold: {
		type: Number,
		default: 0,
	},
	added_date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("BookInstance", bookInstanceSchema);

const mongoose = require("mongoose");
const genreSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		enum: ["Fiction", "Nonfiction"],
	},
});

module.exports = mongoose.model("Genre", genreSchema);

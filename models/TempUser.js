const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	phone_number: {
		type: String,
	},
	name: {
		type: String,
		required: true,
	},
	gender: {
		type: String,
		enum: ["Male", "Female", "Another"],
	},
	date_of_birth: {
		type: Date,
	},
	created_date: {
		type: Date,
		default: Date.now,
		index: { expires: "1d" },
	},
});

module.exports = mongoose.model("TempUser", tempUserSchema);

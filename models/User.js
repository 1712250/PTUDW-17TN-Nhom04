const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	books: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "BookInstance",
		},
	],
	commit_date: {
		type: Date,
		default: Date.now,
	},
});

const userSchema = new mongoose.Schema({
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
	cart: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "BookInstance",
		},
	],
	orders: [orderSchema],
	created_date: {
		type: Date,
		default: Date.now,
	},
});

userSchema.methods.validatePassword = function (password) {
	return password === this.password;
};
module.exports = mongoose.model("User", userSchema);

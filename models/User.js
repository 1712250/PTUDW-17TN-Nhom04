const mongoose = require("mongoose");
const AddressController = require("../controllers/AddressController");

const orderSchema = new mongoose.Schema({
	books: [
		{
			book: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "BookInstance",
			},
			count: {
				type: Number,
				default: 1,
			},
		},
	],
	delivery_address: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Address",
	},
	status: {
		type: String,
		enum: ["delivered", "arriving"],
	},
	committed_date: {
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
	default_address: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Address",
	},
	addresses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Address",
		},
	],
	created_date: {
		type: Date,
		default: Date.now,
	},
});

// add an address to user addresses, return address object if success,
// otherwise, return null
userSchema.methods.addAddress = function (address, setDefault) {
	return AddressController.newAddress(address)
		.then((newAddr) => {
			this.addresses.addToSet(newAddr._id);
			if (setDefault || !this.default_address) {
				this.default_address = newAddr._id;
			}
			return this.save()
				.then(() => {
					return newAddr;
				})
				.catch(() => {
					return null;
				});
		})
		.catch(() => {
			return null;
		});
};

userSchema.methods.setDefaultAddress = function (addressId) {
	this.default_address = addressId;
	return this.save()
		.then((user) => user)
		.catch((err) => {
			console.log("Error while setting default address: " + err.message);
			return null;
		});
};

module.exports = mongoose.model("User", userSchema);

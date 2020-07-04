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

userSchema.methods.removeAddress = function (addressId) {
	this.addresses.pull(addressId);
	if (JSON.stringify(this.default_address) === JSON.stringify(addressId)) {
		if (this.addresses.length > 0) {
			this.default_address = this.addresses[0];
		} else {
			delete this.default_address;
		}
	}
	return this.save();
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

// add a book to cart, return count of that book in cart
userSchema.methods.addToCart = function (bookId) {
	let index = this.getIndexInCart(bookId);
	let count = 0;
	if (index == -1) {
		index = this.cart.length;
		this.cart.push({ book: bookId, count: 1 });
		count = 1;
	} else {
		this.cart[index].count++;
		count = this.cart[index].count;
	}
	return this.save()
		.then(() => {
			return count;
		})
		.catch((err) => {
			console.log("Error while adding book to cart: " + err.message);
		});
};

// get index of a book in cart
userSchema.methods.getIndexInCart = function (bookId) {
	if (this.cart.length == 0) return -1;
	for (let i = 0; i < this.cart.length; ++i) {
		if (JSON.stringify(this.cart[i].book) === JSON.stringify(bookId)) {
			return i;
		}
	}
	return -1;
};

// subtract count of a book from cart by one, delete if
// count == 0, return count of that book
userSchema.methods.removeFromCart = function (bookId, removeAll) {
	let index = this.getIndexInCart(bookId);
	let count = 0;
	if (index != -1) {
		this.cart[index].count--;
		count = this.cart[index].count;
		if (this.cart[index].count == 0 || removeAll) {
			this.cart.remove(this.cart[index]);
		}
	}
	return this.save()
		.then(() => {
			return count;
		})
		.catch((err) => {
			console.log("Error while removing book from cart: " + err.message);
		});
};

module.exports = mongoose.model("User", userSchema);

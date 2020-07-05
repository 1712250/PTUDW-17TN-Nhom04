const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	receiver: {
		type: String,
		required: true,
	},
	phone_number: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
});

// address: Object
addressSchema.methods.updateAddress = function (address) {
	this.receiver = address.receiver;
	this.phone_number = address.phone_number;
	this.address = address.address;
	return this.save()
		.then((res) => {
			return res;
		})
		.catch((err) => {
			console.log("Error while updating address: " + err.message);
			return null;
		});
};

module.exports = mongoose.model("Address", addressSchema);

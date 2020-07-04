const Model = require("../models/Address");
const mongoose = require("mongoose");

// address: Object{receiver, phone_number, address}
module.exports.newAddress = function (address) {
	return this.getByName(address.address).then((res) => {
		if (
			res &&
			res.receiver == address.receiver &&
			res.phone_number == address.phone_number
		) {
			throw { code: 407, message: "Address is already exist!" };
		} else {
			const newAddr = new Model(address);
			return newAddr
				.save()
				.then((res) => {
					return res;
				})
				.catch((err) =>
					console.log("Error while saving address: " + err.message)
				);
		}
	});
};

// address: String
module.exports.getByName = function (address) {
	return Model.findOne({ address }, (err, res) => {
		if (err) {
			console.log("Error while retrieving address by name");
			return null;
		} else {
			return res;
		}
	});
};

// address: String
module.exports.exist = function (address) {
	return this.getByName(address).then((res) => {
		if (res) return true;
		return false;
	});
};

module.exports.getById = function (addressId) {
	return Model.findById(addressId, (err, res) => {
		if (err) {
			console.log("Error while retrieving address by id");
			return null;
		} else {
			return res;
		}
	});
};

module.exports.removeAddress = function (addressId) {
	return Model.deleteOne(
		{ _id: mongoose.Types.ObjectId(addressId) },
		(err, res) => {
			if (err) {
				console.log("Error while removing address: " + err.message);
			} else {
				return res;
			}
		}
	);
};

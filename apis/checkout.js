const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../utils/authmiddleware");
const AddressController = require("../controllers/AddressController");

router.use(isAuthenticated);
router.post("/cart/add", (req, res) => {
	const added = JSON.stringify(req.user.cart.addToSet(req.body.bookId)[0]);
	const bookId = JSON.stringify(req.body.bookId);
	if (added === bookId) {
		req.user.save().then((user) => {
			res.status(200).send("OK");
		});
	} else {
		res.status(409).send("Already added");
	}
});

router.post("/cart/remove", (req, res) => {
	req.user.cart.pull(req.body.bookId);
	req.user.save().then((user) => {
		res.status(200).send("OK");
	});
});

router.post("/shipping/address/get", (req, res) => {
	AddressController.getById(req.body.addressId).then((address) => {
		if (address) {
			res.status(200).send(address);
		} else {
			res.status(404).send({ status: 404, message: "Address not found" });
		}
	});
});

router.post("/shipping/address/add", (req, res) => {
	req.user
		.addAddress(req.body.address, req.body.is_default)
		.then((address) => {
			if (address) {
				res.status(200).send({ status: 200, addressId: address._id });
			} else {
				res.status(409).send({
					status: 409,
					message: "Address is already exist!",
				});
			}
		});
});

router.post("/shipping/address/edit", (req, res) => {
	AddressController.getById(req.body.address._id).then((address) => {
		if (address) {
			address.updateAddress(req.body.address).then((addr) => {
				if (req.body.is_default) {
					req.user.setDefaultAddress(addr._id);
				}
				res.status(200).send({ status: 200, message: "OK" });
			});
		} else {
			res.status(404).send({ status: 404, message: "Address not found" });
		}
	});
});

module.exports = router;

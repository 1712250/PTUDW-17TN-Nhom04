const router = require("express").Router();
const { isAuthenticated } = require("../utils/authmiddleware");
const AddressController = require("../controllers/AddressController");

router.use(isAuthenticated);
router.post("/cart/add", (req, res) => {
	req.user.addToCart(req.body.bookId).then((count) => {
		res.status(200).send({
			status: 200,
			count: count,
		});
	});
});

router.post("/cart/remove", (req, res) => {
	req.user
		.removeFromCart(req.body.bookId, req.body.remove_all)
		.then((count) => {
			res.status(200).send({
				status: 200,
				count: count,
			});
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
	req.body.address.user = req.user._id;
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

router.post("/shipping/address/delete", (req, res) => {
	AddressController.removeAddress(req.body.addressId).then(() => {
		req.user.removeAddress(req.body.addressId).then(() => {
			res.status(200).send({ status: 200, message: "Deleted" });
		});
	});
});

router.post("/payment", (req, res) => {
	req.user
		.addOrder(
			req.body.delivery_method,
			req.body.payment_method,
			req.body.address_id
		)
		.then((user) => {
			if (user) {
				res.status(200).send({ status: 200, message: "Success" });
			} else {
				res.status(500).send({
					status: 500,
					message: "Internal server error...",
				});
			}
		});
});
module.exports = router;

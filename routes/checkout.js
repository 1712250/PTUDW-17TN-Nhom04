const router = require("express").Router();
const { isAuthenticated } = require("../utils/authmiddleware");
const AddressController = require("../controllers/AddressController");

router.use(isAuthenticated);

router.get("/cart", (req, res, next) => {
  res.render("checkout/cart", { title: "Cart" });
});

router.get("/shipping", (req, res, next) => {
  req.user
    .populate("addresses")
    .populate("default_address")
    .execPopulate()
    .then((user) => {
      res.render("checkout/shipping", {
        title: "Shipping",
        addresses: user.addresses,
        default_address: user.default_address,
      });
    })
    .catch((err) =>
      console.log("Error while populate address: " + err.message)
    );
});

router.get("/payment/:addressId", (req, res, next) => {
  AddressController.getById(req.params.addressId).then((address) => {
    res.render("checkout/payment", {
      title: "Payment",
      address: address,
    });
  });
});
module.exports = router;

const router = require("express").Router();
const checkoutRouter = require("./checkout");
const authRouter = require("./authentication");

router.use("/auth", authRouter);
router.use("/checkout", checkoutRouter);

module.exports = router;

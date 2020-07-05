const crypto = require("crypto");

module.exports.randomPassword = () => {
	return (0xfffff + Math.random() * 0xfffff * 1000000)
		.toString(16)
		.slice(0, 8);
};

module.exports.genPassword = (password) => {
	return crypto
		.pbkdf2Sync(password, process.env.SALT, 10000, 64, "sha512")
		.toString("hex");
};

module.exports.validPassword = (password, hash) => {
	var hashVerify = crypto
		.pbkdf2Sync(password, process.env.SALT, 10000, 64, "sha512")
		.toString("hex");
	return hash === hashVerify;
};

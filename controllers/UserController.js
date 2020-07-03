const User = require("../models/User");
const { genPassword } = require("../utils/hashing");

module.exports.login = (req, res) => {};

module.exports.signUp = (req, res) => {
	const user_info = req.body;
	user_info.password = genPassword(user_info.password);
	this.createUser(user_info)
		.then((user) => {
			console.log(user);
			res.status(200).send("OK");
		})
		.catch((err) => {
			res.status(err.code).send(err.message);
		});
};

module.exports.createUser = (user_info) => {
	return this.getUser(user_info.email).then((user) => {
		if (user) {
			throw { code: 409, message: "Email is already existed" };
		} else {
			const user = new User(user_info);
			return user
				.save()
				.then((user) => {
					console.log("Save user with email: " + user_info.email);
					return user;
				})
				.catch((err) => {
					console.log(
						"Error while saving user with email: " +
							user_info.email +
							" --> " +
							err.message
					);
				});
		}
	});
};

module.exports.getUser = (email) => {
	return User.findOne({ email }).catch((err) =>
		console.log("Error while retrieving user: " + err.message)
	);
};

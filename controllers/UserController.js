const User = require("../models/User");

module.exports.createUser = ({
	name,
	email,
	password,
	phone_number,
	gender,
	date_of_birth,
}) => {
	const user = new User({
		name,
		email,
		password,
		phone_number,
		gender,
		date_of_birth,
	});
	return user
		.save()
		.then((user) => {
			console.log("Save user with email: " + email);
			return user;
		})
		.catch((err) => {
			console.log(
				"Error while saving user with email: " +
					user_info.email +
					" --> " +
					err.message
			);
			throw err;
		});
};

module.exports.getUser = (email) => {
	return User.findOne({ email })
		.exec()
		.catch((err) =>
			console.log("Error while retrieving user: " + err.message)
		);
};

module.exports.getUserById = (userId) => {
	return User.findById(userId)
		.exec()
		.catch((err) =>
			console.log("Error while retrieving user: " + err.message)
		);
};

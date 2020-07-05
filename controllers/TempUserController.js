const Model = require("../models/TempUser");

module.exports.createTempUser = (user_info) => {
	const tempUser = new Model(user_info);
	return tempUser
		.save()
		.then((tempUser) => {
			console.log("Save temp user with email: " + user_info.email);
			return tempUser;
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

module.exports.getTempUser = (email) => {
	return Model.findOne({ email })
		.exec()
		.catch((err) =>
			console.log("Error while retrieving temp user: " + err.message)
		);
};

module.exports.getTempUserById = (userId) => {
	return Model.findById(userId)
		.exec()
		.catch((err) =>
			console.log("Error while retrieving temp user: " + err.message)
		);
};

module.exports.deleteTempUser = (userId) => {
	return Model.findByIdAndDelete(userId)
		.exec()
		.then(() => {
			return true;
		})
		.catch((err) => {
			console.log("Error while deleting temp user: " + err.message);
			return false;
		});
};

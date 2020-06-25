const Model = require("../models/Genre");

module.exports.getGenre = async (category) => {
	const query = {};
	if (category) query.category = category;
	try {
		return await Model.find(query).exec();
	} catch (err) {
		console.log("Error while retrieving genres! Error: " + err.message);
		return [];
	}
};

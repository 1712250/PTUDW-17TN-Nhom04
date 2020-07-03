const mongoose = require("mongoose");
mongoose.connect(
	process.env.DB_STRING,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	(err) => {
		if (err) {
			console.log("Cannot connect to database: " + err.message);
		} else {
			console.log("Connected to database...");
		}
	}
);

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	pool: true,
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: "ptudw.obooks@gmail.com",
		pass: "123$%^qweRTY",
	},
});

// verify connection configuration
transporter.verify(function (error) {
	if (error) {
		console.log(error);
	} else {
		console.log("Server is ready to take our messages");
	}
});

module.exports = transporter;

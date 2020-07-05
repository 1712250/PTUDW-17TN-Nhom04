const transporter = require("../config/mail");

const baseUrl = process.env.DEV
	? "http://localhost:5000"
	: "https://obooks.herokuapp.com";
module.exports.sendActivation = function (tempUser) {
	transporter.sendMail({
		from: "ptudw.obooks@gmail.com",
		to: tempUser.email,
		subject: "Obooks: Please activate your account",
		text:
			"Hi there\n\n" +
			"We are happy that you choose to use Obooks.\n\n" +
			"You can activate your account here:\n" +
			`${baseUrl}/account/activation/${tempUser._id}\n\n` +
			"Sincerely,\n" +
			"Obooks",
	});
};

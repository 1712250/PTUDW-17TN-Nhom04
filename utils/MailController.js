const transporter = require("../config/mail");

module.exports.sendActivation = function (tempUser) {
	transporter.sendMail({
		from: "ptudw.obooks@gmail.com",
		to: tempUser.email,
		subject: "Obooks: Please activate your account",
		text:
			"Hi there\n\n" +
			"We are happy that you choose to use Obooks.\n\n" +
			"You can activate your account here:\n" +
			`http://localhost:5000/account/activation/${tempUser._id}\n\n` +
			"Sincerely,\n" +
			"Obooks",
	});
};

module.exports.sendMail = function (recipient, title, plaintext) {
	transporter.sendMail({
		from: "ptudw.obooks@gmail.com",
		to: recipient, //"recipient@example.com",
		subject: title,
		text: "http://localhost:5000/api/auth/forgetpassword",
	});
};

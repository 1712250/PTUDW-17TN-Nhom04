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
			"Hi there,\n\n" +
			"We are happy that you choose to use Obooks.\n\n" +
			"You can activate your account here:\n" +
			`${baseUrl}/account/activation/${tempUser._id}\n\n` +
			"Sincerely,\n" +
			"Obooks",
	});
};

module.exports.sendResetPassword = function (password, user) {
	transporter.sendMail({
		from: "ptudw.obooks@gmail.com",
		to: user.email,
		subject: "Obooks: Here's your reset password",
		text:
			"Hi there,\n\n" +
			"We are sorry that you lost your password.\n\n" +
			"Anyway, you can login into your account by using this password:\n" +
			`${password}\n\n` +
			"Sincerely,\n" +
			"Obooks",
		html: `
			<p>Hi there,<p>
			<p>We are sorry that you lost your password.</p>
			<p>
				But don't worry, you can login into your account by using this password:<br>
				<b>${password}</b>
			<p>
			<p>
				Sincerely,<br>
				Obooks
			</p>`,
	});
};

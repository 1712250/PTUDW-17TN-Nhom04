const loginForm = document.getElementById("login-form");
const signUpForm = document.getElementById("sign-up-form");

document.addEventListener("DOMContentLoaded", () => {
	loginForm.addEventListener("submit", doLogin);
	signUpForm.addEventListener("submit", doSignUp);
	signUpForm
		.querySelector("#password")
		.addEventListener("change", validatePassword);
	signUpForm
		.querySelector("#retype")
		.addEventListener("keyup", validatePassword);
});

function doLogin(e) {
	e.preventDefault();
	fetch("/api/login/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: loginForm.querySelector("#login-email").value,
			password: loginForm.querySelector("#login-password").value,
		}),
	}).then((res) => {
		if (res.ok) {
			location.reload();
		} else {
		}
	});
}

function doSignUp(e) {
	e.preventDefault();
	fetch("/api/signup/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: signUpForm.querySelector("#fullName").value,
			email: signUpForm.querySelector("#email").value,
			password: signUpForm.querySelector("#password").value,
			phone_number: signUpForm.querySelector("#phoneNumber").value,
			gender: signUpForm.querySelector("#gender  > div > input:checked")
				.value,
			date_of_birth: signUpForm.querySelector("#date-of-birth").value,
		}),
	}).then((res) => {
		if (res.ok) {
			location.reload();
		} else {
		}
	});
}

function doLogout() {
	fetch("/api/logout/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	}).then((res) => {
		if (res.ok) {
			location.href = "/";
		} else {
		}
	});
}

function validatePassword() {
	const password = signUpForm.querySelector("#password");
	const password_retype = signUpForm.querySelector("#retype");
	if (password.value != password_retype.value) {
		password_retype.setCustomValidity("Passwords don't match");
		return;
	} else {
		password_retype.setCustomValidity("");
	}
}

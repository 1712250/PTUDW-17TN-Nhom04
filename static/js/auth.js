const loginForm = document.getElementById("login-form");
const signUpForm = document.getElementById("sign-up-form");
const forgetPassForm = document.querySelector("#forgetPasswordModal form");

loginForm.addEventListener("submit", doLogin);
signUpForm.addEventListener("submit", doSignUp);
forgetPassForm.addEventListener("submit", doForgetPassword);
document.getElementById("hrefForgetPass").addEventListener("click", (e) => {
	e.preventDefault();
	$("#loginModal").modal("hide");
	$("#forgetPasswordModal").modal("show");
});

signUpForm
	.querySelector("#password")
	.addEventListener("change", validatePassword);
signUpForm.querySelector("#retype").addEventListener("keyup", validatePassword);

function doLogin(e) {
	e.preventDefault();
	fetch("/api/auth/login/", {
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
			showSnackbar("Login successfully!");
			location.reload();
		} else {
			showSnackbar("Wrong email address or password!");
		}
	});
}

function doSignUp(e) {
	e.preventDefault();
	fetch("/api/auth/signup/", {
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
			showSnackbar(
				"Sign up successfully, please check your email for activation link!"
			);
		} else {
			showSnackbar("Email address already exist!");
		}
		setTimeout(() => $("#loginModal").modal("hide"), 1000);
	});
}

function doLogout() {
	fetch("/api/auth/logout/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	}).then((res) => {
		if (res.ok) {
			showSnackbar("Log out successfully! Redirect...");
			location.href = "/";
		} else {
			showSnackbar("Server is busy...");
			location.href = "/";
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

function doForgetPassword(e) {
	e.preventDefault();
	fetch("/api/auth/forgetpassword", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: forgetPassForm.querySelector("input").value,
		}),
	}).then((res) => {
		if (res.ok) {
			showSnackbar("Sent! Check your email");
		} else {
			showSnackbar("Server is busy...");
		}
		setTimeout(() => $("#forgetPasswordModal").modal("hide"), 1000);
	});
}

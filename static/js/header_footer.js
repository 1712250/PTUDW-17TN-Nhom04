const headerSearch = document.querySelector(
	".navbar > .navbar-collapse > form"
);

headerSearch.querySelector("div > button").addEventListener("click", (e) => {
	e.preventDefault();
	const input = headerSearch.querySelector("input");
	location.href =
		"/browse?search=" +
		input.value.trim().split(/\s+/).join("-").toLowerCase();
});

function showQuestionModal(title, message, cb) {
	const modal = $("#question-modal");
	modal.find(".modal-header h5").text(title);
	modal.find(".modal-body").text(message);
	modal.find("button:last-child").click(cb);
	modal.modal({
		show: true,
	});
}

function showSnackbar(msg) {
	let snackbar = document.getElementById("snackbar");
	snackbar.innerText = msg;
	snackbar.className = "show";
	setTimeout(function () {
		snackbar.className = snackbar.className.replace("show", "");
	}, 2000);
}

const headerSearch = document.querySelector(
	".navbar > .navbar-collapse > form"
);

document.addEventListener("DOMContentLoaded", () => {
	headerSearch
		.querySelector("div > button")
		.addEventListener("click", (e) => {
			e.preventDefault();
			const input = headerSearch.querySelector("input");
			location.href =
				"/browse?search=" +
				input.value.trim().split(/\s+/).join("-").toLowerCase();
		});
});

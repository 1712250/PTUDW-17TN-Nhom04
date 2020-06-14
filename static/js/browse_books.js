const listBooks = document.querySelector(".list-books");
const cartBadge = document.querySelector(".cart-badge");
const pagination = document.querySelector(".pagination");
const listGenres = document.querySelector(".select-genres");
const listTags = document.querySelector(".tags-container");
const listConditions = document.querySelector(".list-conditions");
const listLanguages = document.querySelector(".list-languages");
const btnPrice = document.querySelector(".price-btn");
const btnCondition = document.querySelector(".list-conditions button");
const btnLanguage = document.querySelector(".list-languages button");
const searchForm = document.querySelector("div.search-container > form");

const books = [
	{
		id: 1,
		authorId: 123,
		name: "What do I talk about happiness g",
		author: "Rosy Nguyen",
		price: "$123",
		img: "/images/book.svg",
	},
	{
		id: 2,
		authorId: 456,
		name: "What do I talk",
		author: "Rosy Nguyen Nguyen Nguyen",
		price: "$12",
		img: "/images/book.svg",
	},
	{
		id: 3,
		authorId: 456,
		name:
			"What do I talk What do I talk What do I talk What do I talk vWhat do I talk",
		author: "Rosy",
		price: "$12",
		img: "/images/book.svg",
	},
	{
		id: 4,
		authorId: 456,
		name:
			"What do I talk What do I talk What do I talk What do I talk vWhat do I talk",
		author: "Rosy",
		price: "$12",
		img: "/images/book.svg",
	},
];

const genres = [
	"Action and adventure",
	"Art",
	"Alternate history",
	"Autobiography",
	"Anthology",
	"Biography",
	"Chick lit",
	"Book review",
	"Children's",
	"Cookbook",
	"Comic books",
];

document.addEventListener("DOMContentLoaded", () => {
	// Add event listener
	btnPrice.addEventListener("click", btnPriceClicked);
	btnCondition.addEventListener("click", btnConditionClicked);
	btnLanguage.addEventListener("click", btnLanguageClicked);
	searchForm.addEventListener("submit", onSearchSubmit);

	// Parse URL
	const queries = parseURL();

	// Keep scroll
	if (location.href.indexOf("page_y") != -1) {
		document.getElementsByTagName("html")[0].scrollTop = queries.page_y - 1;
		delete queries.page_y;
	}

	// Render
	renderFilter(queries);
	renderSelect(genres);
	renderBooks(books);

	// Return object {
	// 	genres: [],
	// 	totalPages: 1,
	// 	books: []
	// }

	// fetch("/api/books", {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// 	body: JSON.stringify(queries),
	// })
	// 	.then((r) => r.json())
	// 	.then((data) => {
	// 		renderSearch(data.genres);
	// 		renderBooks(data.books);
	// 		renderPagination(queries.page, data.totalPages);
	// 	})
	// 	.catch((error) => {
	// 		// console.error("Error:", error);
	// 	});
});

function parseURL() {
	const queries = {};
	// if (location.search.length > 0) queries = {};
	location.search
		.slice(1)
		.split("&")
		.map((u) => u.split("="))
		.forEach(([key, value]) => {
			if (key) {
				if (key.endsWith("[]")) {
					key = key.slice(0, -2);
					if (!queries[key]) queries[key] = [];
					queries[key].push(value);
				} else queries[key] = value;
			}
		});
	if (!queries.page) {
		queries.page = 1;
	}
	return queries;
}

function createText(text) {
	return document.createTextNode(text);
}
function createElement(tag, attributes, ...children) {
	const e = document.createElement(tag);
	for (let [key, value] of Object.entries(attributes)) {
		e.setAttribute(key, value);
	}
	children.forEach((child) => e.appendChild(child));
	return e;
}

function addToCart(bookId) {
	cartBadge.innerText = parseInt(cartBadge.innerText) + 1;
}

function renderSelect(genres) {
	const options = genres.map((genre) =>
		createElement("option", { value: genre.toLowerCase }, createText(genre))
	);
	listGenres.append(...options);
}

function toggleTag(field, tag, replaceSameField) {
	for (let tagElement of listTags.children) {
		if (tagElement.dataset.field === field) {
			if (tagElement.children[0].innerText === tag) {
				tagElement.remove();
				return;
			} else if (replaceSameField) {
				tagElement.remove();
				break;
			}
		}
	}
	addTag(field, tag);
}

function addTag(field, tag) {
	listTags.appendChild(
		createElement(
			"div",
			{ class: "tag px-2 py-1", "data-field": field },
			createElement(
				"p",
				{},
				createText(tag),
				createElement("i", {
					class: "fas fa-times pl-1",
					onclick: "removeElement(this)",
				})
			)
		)
	);
}

function normalizeTag(tag) {
	return tag.replace(/-/g, " ").replace(/(^\w)/, function (v) {
		return v.toUpperCase();
	});
}

function checkbox(key, tag) {
	let list;
	if (key === "condition") {
		list = listConditions;
	} else if (key === "language") {
		list = listLanguages;
	} else {
		return;
	}

	for (let checkbox of list.getElementsByTagName("input")) {
		if (checkbox.value === tag) {
			checkbox.checked = "true";
		}
	}
}

function renderFilter(queries) {
	for (let [key, value] of Object.entries(queries)) {
		if (key === "sortBy") {
		} else if (key === "search") {
		} else if (key === "page") {
		} else if (key === "minPrice") {
			document.querySelector(".price-input.min").value = value;
		} else if (key === "maxPrice") {
			document.querySelector(".price-input.max").value = value;
		} else {
			if (Array.isArray(value)) {
				value.forEach((tag) => {
					tag = normalizeTag(tag);
					toggleTag(key, tag, false);
					checkbox(key, tag);
				});
			} else {
				value = normalizeTag(value);
				toggleTag(key, value, false);
				checkbox(key, value);
			}
		}
	}
}

function renderPagination(currentPage, totalPages) {}

function renderBooks(books) {
	const bookElements = books.map((book) =>
		createElement(
			"a",
			{
				class: "d-block col-12 col-sm-6 col-lg-4 col-xl-3",
				href: "/browse/book?id=" + book.id,
			},
			createElement(
				"div",
				{ class: "card my-2 pt-3" },
				createElement("img", {
					src: book.img,
					class: "card-img-top",
				}),
				createElement(
					"div",
					{ class: "card-body" },
					createElement(
						"p",
						{ class: "book-name text-truncate" },
						createText(book.name)
					),
					createElement(
						"a",
						{
							href: "/browse/author?id=" + book.authorId,
						},
						createElement(
							"p",
							{ class: "book-author text-truncate" },
							createText(book.author)
						)
					),
					createElement(
						"p",
						{ class: "book-price" },
						createText(book.price)
					),
					createElement(
						"a",
						{
							class: "btn w-100",
							href: `javascript:addToCart(${book.id})`,
						},
						createText("Add to cart")
					)
				)
			)
		)
	);
	listBooks.append(...bookElements);
}

function removeElement(target) {
	target.parentElement.parentElement.remove();
	updatePage();
}

function updatePage(queries = {}) {
	for (let tag of listTags.children) {
		let key = tag.dataset.field;
		let value = tag.children[0].innerText
			.replace(/\s+/g, "-")
			.toLowerCase();
		if (key === "condition" || key === "language") {
			if (!queries[key]) queries[key] = [];
			queries[key].push(value);
		} else {
			if (!queries[key]) queries[key] = value;
		}
	}

	let url = location.origin + location.pathname + "?";
	for (let [key, value] of Object.entries(queries)) {
		if (Array.isArray(value)) {
			key = key + "[]";
			value.forEach((param) => (url = url + key + "=" + param + "&"));
		} else {
			url = url + key + "=" + value + "&";
		}
	}

	var page_y = document.getElementsByTagName("html")[0].scrollTop;
	location.href = url + "page_y=" + page_y;
}

function btnPriceClicked(e) {
	e.preventDefault();
	const minPrice = parseFloat(
		document.querySelector(".price-input.min").value
	);
	const maxPrice = parseFloat(
		document.querySelector(".price-input.max").value
	);

	if (!minPrice && !maxPrice) {
		showSnackbar("Please type min price or max price!");
		return;
	}

	queries = {};
	if (minPrice) {
		queries.minPrice = minPrice;
	}
	if (maxPrice) {
		queries.maxPrice = maxPrice;
	}
	updatePage(queries);
}

function btnConditionClicked(e) {
	e.preventDefault();
	updatePage();
}

function btnLanguageClicked(e) {
	e.preventDefault();
	updatePage();
}

function showSnackbar(msg) {
	let snackbar = document.getElementById("snackbar");
	snackbar.innerText = msg;
	snackbar.className = "show";
	setTimeout(function () {
		snackbar.className = snackbar.className.replace("show", "");
	}, 2000);
}

function toggleCondition(target) {
	toggleTag("condition", target.value, false);
}

function sortByClicked(sortOrder) {
	updatePage({ sortBy: sortOrder });
}

function onSearchSubmit(e) {
	e.preventDefault();
	const input = searchForm.querySelector("input");
	updatePage({
		search: input.value.trim().split(/\s+/).join("-").toLowerCase(),
	});
}

function onRatingClicked(rating) {
	updatePage({ rating: rating.replace(/\s+/g, "-") });
}

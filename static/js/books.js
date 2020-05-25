const listBooks = document.querySelector(".list-books");
const cartBadge = document.querySelector(".cart-badge");
const pagination = document.querySelector(".pagination");
const listGenres = document.querySelector(".select-genres");
const listTags = document.querySelector(".tags-container");
const btnPrice = document.querySelector(".price-btn");
let queries = { page: 1 };

const books = [
	{
		id: 1,
		authorId: 123,
		name: "What do I talk about happiness g",
		author: "Rosy Nguyen",
		price: "$123",
		img: "../static/images/book.svg",
	},
	{
		id: 2,
		authorId: 456,
		name: "What do I talk",
		author: "Rosy Nguyen Nguyen Nguyen",
		price: "$12",
		img: "../static/images/book.svg",
	},
	{
		id: 3,
		authorId: 456,
		name:
			"What do I talk What do I talk What do I talk What do I talk vWhat do I talk",
		author: "Rosy",
		price: "$12",
		img: "../static/images/book.svg",
	},
	{
		id: 4,
		authorId: 456,
		name:
			"What do I talk What do I talk What do I talk What do I talk vWhat do I talk",
		author: "Rosy",
		price: "$12",
		img: "../static/images/book.svg",
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
	// Render
	handleQueriesURL();
	renderBooks({ currentPage: 1, totalPages: 1, books: books });
	renderSelect();
	// fetch("/api/books", {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// 	body: JSON.stringify(queries),
	// })
	// 	.then((r) => r.json())
	// 	.then((data) => {
	// 		renderBooks(data);
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error:", error);
	// 	});
});

function handleQueriesURL() {
	if (location.search.length > 0)
		queries = Object.fromEntries(
			location.search
				.slice(1)
				.split("&")
				.map((u) => u.split("="))
		);
	if (!queries.page) {
		queries.page = 1;
	}
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

function renderSelect() {
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

function renderTags(tags) {
	tags.forEach((tag) => addTag("field", tag));
}

function renderPagination(currentPage, totalPages) {}

function renderBooks({ currentPage, totalPages, books }) {
	console.log(books);
	renderPagination(currentPage, totalPages);
	const bookElements = books.map((book) =>
		createElement(
			"a",
			{
				class: "d-block col-12 col-sm-6 col-lg-4 col-xl-3",
				href: "/books/detail.html?id=" + book.id,
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
							href: "/books/author.html?id=" + book.authorId,
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

function updatePage() {}

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
	if (!minPrice) {
		queries.minPrice = minPrice;
	}
	if (!maxPrice) {
		queries.maxPrice = maxPrice;
	}
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
	console.log(target);
	toggleTag("condition", target.value, false);
}

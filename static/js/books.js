const listBooks = document.querySelector(".list-books");
const createText = (s) => document.createTextNode(s);
const cartBadge = document.querySelector(".cart-badge");

const books = [
	{
		id: 1,
		authorId: 123,
		name: "What do I talk about happiness",
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
];

renderBooks(books);

function createElement(tag, attributes, ...children) {
	const e = document.createElement(tag);
	for (let [key, value] of Object.entries(attributes)) {
		e.setAttribute(key, value);
	}
	children.forEach((child) => e.appendChild(child));
	return e;
}

function getBooks(filter, page) {
	let url = "/browse.html?page=" + page;
	for (let [key, value] of Object.entries(filter)) {
		url = url + "&" + key + "=" + value;
	}
	console.log(url);

	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			renderBooks(JSON.parse(this.responseText));
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

function addToCart(bookId) {
	cartBadge.innerText = parseInt(cartBadge.innerText) + 1;
}

function renderBooks(books) {
	console.log(books);
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

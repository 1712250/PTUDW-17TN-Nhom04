// main.js

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const URL = "https://www.waterstones.com/category/fiction/format/17";

const fiction = new Set();
const nonfiction = new Set();
const authors = new Set();

let callback = (err, file) => {
	if (err) throw err;
	console.log("Saved!");
};

fetchFiction().then((urls) =>
	fetchBooks(urls).then((books) => {
		fs.writeFile(
			"fiction.json",
			JSON.stringify(Array.from(fiction)),
			callback
		);
		fs.writeFile(
			"nonfiction.json",
			JSON.stringify(Array.from(nonfiction)),
			callback
		);
		fs.writeFile(
			"authors.json",
			JSON.stringify(Array.from(authors)),
			callback
		);
		fs.writeFile("books.json", JSON.stringify(books), callback);
	})
);

async function fetchFiction() {
	console.log("Get links...");
	let urls = [];
	for (let i = 0; i < 10; i++) {
		let url = URL + "/page/" + i;
		let res = await doPost(url);
		if (!res) {
			return;
		}

		let html = res.data;
		let $ = cheerio.load(html);
		let selected = $("div.book-preview > div");
		selected.each(function () {
			let url =
				"https://www.waterstones.com" +
				$(this).find("div.title-wrap > a").attr("href");
			urls.push(url);
			console.log("----> " + url);
		});
	}
	return urls;
}

async function fetchBooks(urls) {
	console.log("Get books...");
	let books = [];
	for (let i = 0; i < urls.length; i++) {
		let res = await doGet(urls[i]);
		if (!res) {
			return;
		}

		let html = res.data;
		let $ = cheerio.load(html);

		let title = $("h1.title").first().text().replace(" (Paperback)", "");
		console.log("---> Fetch " + title);

		let genres = new Set();
		$("div.breadcrumbs > a[href='/category/fiction'] + a").each(
			function () {
				let genre = $(this).text();
				genres.add(genre);
				fiction.add(genre);
			}
		);

		$("div.breadcrumbs > br + a").each(function () {
			let genre = $(this).text();
			if (genre != "Fiction") {
				genres.add(genre);
				nonfiction.add(genre);
			}
		});

		let author = $("div.book-info > span.contributors > a > b > span")
			.first()
			.text();
		authors.add(author);

		books.push({
			title: title,
			description: $("div.pdp-waterstones-says > p").first().text(),
			author: author,
			rating:
				$("div.rating > div.star-rating > span.star-icon.full").length +
				0.5 *
					$("div.rating > div.star-rating > span.star-icon.half")
						.length,
			genres: Array.from(genres),
			image_url: $("section.book-detail ul.inner img")
				.first()
				.attr("src"),
		});
	}
	return books;
}

async function doGet(url) {
	let response = await axios.get(url).catch((err) => {
		console.log("An error occurs when fetch url: " + url);
	});
	return response;
}

async function doPost(url) {
	let response = await axios.post(url).catch((err) => {
		console.log("An error occurs when fetch url: " + url);
	});
	return response;
}

require("dotenv").config();

const mongoose = require("mongoose");
const Book = require("./models/Book");
const Author = require("./models/Author");
const BookInstance = require("./models/BookInstance");
const Genre = require("./models/Genre");

const languages = ["Vietnamese", "German", "English", "Chinese"];
const status = [
	"New",
	"Like new",
	"Very good",
	"Good",
	"Acceptable",
	"A bit old",
];

const MAX_PRICE = 50;
const MIN_PRICE = 5;
const MAX_DISCOUNT = 75;
const MAX_COUNT = 10;
const MAX_SOLD = 10;

const authors_map = new Map();
const genres_map = new Map();
const saved_books = [];

const fs = require("fs");
const authorsJSON = JSON.parse(fs.readFileSync("./static/mockup/authors.json"));
const fictionJSON = JSON.parse(
	fs.readFileSync("./static/mockup/fiction.json")
).map((genre) => genre.replace("&", "and"));
const nonfictionJSON = JSON.parse(
	fs.readFileSync("./static/mockup/nonfiction.json")
).map((genre) => genre.replace("&", "and"));
const booksJSON = JSON.parse(fs.readFileSync("./static/mockup/books.json"));

main();

async function main() {
	await connectDB();
	await Promise.all([
		saveAuthors(authorsJSON),
		saveGenres(fictionJSON, "Fiction"),
		saveGenres(nonfictionJSON, "Nonfiction"),
	]);
	await saveBooks(booksJSON);
	await saveBookInstances(saved_books);

	console.log("All done! Close connection...");
	await mongoose.connection.close();
}

async function connectDB() {
	try {
		await mongoose.connect(process.env.DB_STRING, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to database...");
	} catch (err) {
		console.log("Cannot connect to database: " + err.message);
	}
}

function saveAuthors(authorsJSON) {
	return Promise.all(authorsJSON.map((author) => createAuthor(author)))
		.then((mixed) => {
			mixed.forEach(([authorJSON, author]) => {
				if (author) authors_map.set(authorJSON, author);
			});
		})
		.catch((err) => {
			console.log(
				"Error while saving authors (err: " + err.message + ")"
			);
		});
}

function saveGenres(genresJSON, category) {
	return Promise.all(
		genresJSON.map((genreJSON) => createGenre(genreJSON, category))
	)
		.then((mixed) => {
			mixed.forEach(([genreJSON, genre]) => {
				if (genre) genres_map.set(genreJSON, genre);
			});
		})
		.catch((err) => {
			console.log("Error while saving genres (err: " + err.message + ")");
		});
}

function saveBooks(booksJSON) {
	return Promise.all(
		booksJSON.map((bookJSON) =>
			createBook(
				bookJSON.title,
				bookJSON.description,
				authors_map.get(bookJSON.author),
				bookJSON.rating,
				bookJSON.genres.map((genre) =>
					genres_map.get(genre.replace("&", "and"))
				),
				bookJSON.image_url
			)
		)
	)
		.then((books) => {
			books.forEach((book) => {
				if (book) saved_books.push(book);
			});
		})
		.catch((err) =>
			console.log("Error while saving books (err: " + err.message + ")")
		);
}

function saveBookInstances(books) {
	return Promise.all(books.map((book) => createBookInstance(book)));
}

async function createAuthor(name) {
	let author = new Author({ name: name });
	try {
		await author.save();
		console.log("Save author: " + name);
		return [name, author];
	} catch (err) {
		console.log("Error while saving genre (err: " + err.message + ")");
		return [name, null];
	}
}

async function createGenre(name, category) {
	let genre = new Genre({ name: name, category: category });
	try {
		await genre.save();
		console.log("Save genre: " + name);
		return [name, genre];
	} catch (err) {
		console.log("Error while saving genre (err: " + err.message + ")");
		return [name, null];
	}
}

async function createBook(
	title,
	description,
	author,
	rating,
	genres,
	image_url
) {
	let book = new Book({
		title: title,
		description: description,
		author: author,
		rating: rating,
		genres: genres,
		image_url: image_url,
	});
	try {
		await book.save();
		console.log("Save book: " + title);
		return book;
	} catch (err) {
		console.log("Error while save book (err: " + err.message + ")");
		return null;
	}
}

async function createBookInstance(book) {
	let bookInstance = new BookInstance({
		book: book,
		language: languages[Math.floor(Math.random() * languages.length)],
		status: status[Math.floor(Math.random() * status.length)],
		price:
			Math.floor(
				(MIN_PRICE + Math.random() * (MAX_PRICE - MIN_PRICE)) * 2
			) / 2,
		discount: Math.floor(Math.random() * MAX_DISCOUNT),
		count: Math.floor(Math.random() * MAX_COUNT),
		sold: Math.floor(Math.random() * MAX_SOLD),
	});
	try {
		await bookInstance.save();
		console.log("Save book instance: " + book.title);
	} catch (err) {
		console.log(
			"Error while saving book instance (err: " + err.message + ")"
		);
	}
}

const router = require("express").Router();
const { getGenre } = require("../controllers/GenreController");
const {
  getBookInstance,
  getBookInstances,
} = require("../controllers/BookInstanceController");

router.get("/", async (req, res, next) => {
  const queries = parseURL(req._parsedOriginalUrl.query);
  const genres = await getGenre(queries.category);
  const { bookInstances, totalPages } = await getBookInstances(queries);

  let selectedPage = parseInt(queries.page);
  const renderedPages = [];

  if (selectedPage < 1) selectedPage = 1;
  else if (selectedPage > totalPages) selectedPage = totalPages;

  if (selectedPage == 1) {
    renderedPages.push(1);
    if (totalPages > 1) renderedPages.push(2);
    if (totalPages > 2) renderedPages.push(3);
  } else if (selectedPage == totalPages) {
    if (totalPages > 2) renderedPages.push(totalPages - 2);
    if (totalPages > 1) renderedPages.push(totalPages - 1);
    renderedPages.push(totalPages);
  } else {
    renderedPages.push(selectedPage - 1);
    renderedPages.push(selectedPage);
    renderedPages.push(selectedPage + 1);
  }

  res.render("browse_books", {
    title: "Browse",
    genres: genres,
    selectedGenre: queries.genre,
    bookInstances: bookInstances,
    renderedPages: renderedPages,
    selectedPage: selectedPage,
    totalPages: totalPages,
  });
});

router.get("/book", async (req, res, next) => {
  const id = req._parsedOriginalUrl.query.split("=")[1];
  const bookInstance = await getBookInstance(id);
  if (bookInstance) {
    const relatedBooks = await getBookInstances({
      page: 1,
      genre: bookInstance.book.genres[0].name,
      sortBy: "New",
    });
    res.render("book_detail", {
      title: "Book Detail",
      bookInstance,
      relatedBooks: relatedBooks.bookInstances.slice(1, 6),
    });
  } else next();
});

module.exports = router;

function parseURL(urlQuery) {
  if (!urlQuery) return { page: 1 };

  const queries = { page: 1 };
  decodeURIComponent(urlQuery)
    .split("&")
    .map((u) => u.split("="))
    .forEach(([key, value]) => {
      value = value.replace(/-/g, " ").replace(/(^\w)/, function (v) {
        return v.toUpperCase();
      });
      if (key) {
        if (key.endsWith("[]")) {
          key = key.slice(0, -2);
          if (!queries[key]) queries[key] = [];
          queries[key].push(value);
        } else queries[key] = value;
      }
    });
  return queries;
}

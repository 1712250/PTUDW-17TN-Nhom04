const listBooks = document.querySelector(".list-books");
const cartBadge = document.querySelector(".cart-badge");
const listGenres = document.querySelector(".books-filter .select-genres");
const listTags = document.querySelector(".tags-container");
const listConditions = document.querySelector(".list-conditions");
const listLanguages = document.querySelector(".list-languages");
const btnPrice = document.querySelector(".price-btn");
const btnCondition = document.querySelector(".list-conditions button");
const btnLanguage = document.querySelector(".list-languages button");
const searchForm = document.querySelector(".search-container > .input-group");

// Add event listener
btnPrice.addEventListener("click", btnPriceClicked);
btnCondition.addEventListener("click", btnConditionClicked);
btnLanguage.addEventListener("click", btnLanguageClicked);
searchForm
  .querySelector("div > button")
  .addEventListener("click", onSearchSubmit);
listGenres.addEventListener("change", onGenreSelected);

// Parse URL
const queries = parseURL();

// Keep scroll
if (location.href.indexOf("page_y") != -1) {
  document.getElementsByTagName("html")[0].scrollTop = queries.page_y - 1;
  delete queries.page_y;
}

// Render
renderFilter(queries);

// functions implementation
function parseURL() {
  const queries = {};
  location.search
    .slice(1)
    .split("&")
    .map((u) => u.split("="))
    .forEach(([key, value]) => {
      if (key) {
        value = decodeURIComponent(value);
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
  fetch("/api/checkout/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookId: bookId }),
  })
    .then((res) => res.json())
    .then((body) => {
      console.log(body.status);
      if (body.status == 200) {
        cartBadge.classList.remove("d-none");
        if (body.count == 1) {
          cartBadge.innerText = parseInt(cartBadge.innerText) + 1;
        }
        showSnackbar(`Added! ${body.count} of this book is currently in cart`);
      } else if (body.status == 401) {
        $("#loginModal").modal({ show: true });
      }
    });
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
      searchForm.querySelector("input").value = value.replace("-", " ");
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

function removeElement(target) {
  target.parentElement.parentElement.remove();
  updatePage();
}

function updatePage(newQueries = {}) {
  const { minPrice, maxPrice } = getPriceInterval();
  if (minPrice && maxPrice && minPrice > maxPrice) {
    showSnackbar("Min price must be less than or equal to max price!");
    return;
  }
  if (minPrice) {
    newQueries.minPrice = minPrice;
  }
  if (maxPrice) {
    newQueries.maxPrice = maxPrice;
  }
  if (!newQueries.search) {
    newQueries.search = queries.search;
  }

  for (let tag of listTags.children) {
    let key = tag.dataset.field;
    let value = tag.children[0].innerText.replace(/\s+/g, "-");
    if (key === "condition" || key === "language") {
      if (!newQueries[key]) newQueries[key] = [];
      newQueries[key].push(value);
    } else {
      if (!newQueries[key]) newQueries[key] = value;
    }
  }

  let url = location.origin + location.pathname + "?";
  for (let [key, value] of Object.entries(newQueries)) {
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

function getPriceInterval() {
  const minPrice = parseFloat(document.querySelector(".price-input.min").value);
  const maxPrice = parseFloat(document.querySelector(".price-input.max").value);

  const queries = {};
  if (minPrice) {
    queries.minPrice = minPrice;
  }
  if (maxPrice) {
    queries.maxPrice = maxPrice;
  }
  return queries;
}
function btnPriceClicked(e) {
  e.preventDefault();
  updatePage();
}

function btnConditionClicked(e) {
  e.preventDefault();
  updatePage();
}

function btnLanguageClicked(e) {
  e.preventDefault();
  updatePage();
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
  location.href =
    "/browse?search=" + input.value.trim().split(/\s+/).join("-").toLowerCase();
}

function onRatingClicked(rating) {
  updatePage({ rating: rating.replace(/\s+/g, "-") });
}

function onGenreSelected(e) {
  updatePage({ genre: e.target.value.replace(/\s+/g, "-") });
}

function onPaginationClicked(target) {
  const currentPage = parseInt(
    document.querySelector(
      ".list-books-container > .pagination > .page-item.active > a"
    ).innerText
  );

  if (target === "Previous") {
    updatePage({ page: currentPage - 1 });
  } else if (target === "Next") {
    updatePage({ page: currentPage + 1 });
  } else {
    updatePage({ page: parseInt(target) });
  }
}

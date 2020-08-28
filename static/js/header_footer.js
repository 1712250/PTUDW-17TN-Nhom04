const headerSearch = document.querySelector(
  ".navbar > .navbar-collapse > form"
);
const headerCart = document.querySelector("#account > li:first-child > a");

headerSearch.querySelector("div > button").addEventListener("click", (e) => {
  e.preventDefault();
  const input = headerSearch.querySelector("input");
  location.href =
    "/browse?search=" + input.value.trim().split(/\s+/).join("-").toLowerCase();
});

headerCart.addEventListener("hover", () => {
  const cartPreview = document.querySelector(
    "#account .shopping-cart-container"
  );
  cartPreview.classList.toggle("d-none");
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
  snackbar.querySelector("div").innerText = msg;
  snackbar.classList.add("show");
  setTimeout(function () {
    snackbar.classList.remove("show");
  }, 2000);
}

function removeFromCart(bookId) {
  showQuestionModal(
    "Information",
    "Do you want to remove this book from cart?",
    () => {
      fetch("/api/checkout/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: bookId, remove_all: true }),
      }).then((res) => {
        if (res.ok) {
          location.reload();
        }
      });
    }
  );
}

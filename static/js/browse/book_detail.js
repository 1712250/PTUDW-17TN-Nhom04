const itemCount = document.querySelector(
  ".book-detail > .infor-book > .detail-book > .add-form > .input-group > input"
);
const cartBadge = document.querySelector(".cart-badge");

function increaseNumber() {
  itemCount.value = parseInt(itemCount.value) + 1;
}

function decreaseNumber() {
  const number = parseInt(itemCount.value) - 1;
  if (number > 0) {
    itemCount.value = number;
  }
}

function addToCart(bookId) {
  fetch("/api/checkout/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bookId: bookId,
      numberToAdd: parseInt(itemCount.value),
    }),
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

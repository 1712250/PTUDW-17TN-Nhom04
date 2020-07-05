document.getElementById("order-button").addEventListener("click", orderBooks);

function orderBooks(e) {
	e.preventDefault();
	const delivery_method = document.querySelector(
		".options > .option > input:checked[name=delivery-method]"
	).value;
	const payment_method = document.querySelector(
		".options > .option > input:checked[name=payment-method]"
	).value;
	const address_id = document.querySelector(".information > .address").id;

	fetch("/api/checkout/payment", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			delivery_method,
			payment_method,
			address_id,
		}),
	})
		.then((res) => res.json())
		.then((body) => {
			if (body.status == 200) {
				showSnackbar("Order successfully! Redirect...");
				location.href = "/account/orders";
			} else {
				showSnackbar("Server is busy! Try again later");
				location.href = "/checkout/cart";
			}
		});
}

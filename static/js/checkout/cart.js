function increaseNumber(bookId) {
	const item = document.getElementById(bookId);
	const number = parseInt(item.querySelector("input").value) + 1;
	item.querySelector("input").value = number;
	fetch("/api/checkout/cart/add", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ bookId: bookId }),
	});
}

function decreaseNumber(bookId) {
	const item = document.getElementById(bookId);
	const number = parseInt(item.querySelector("input").value) - 1;
	if (number == 0) {
		removeFromCart(bookId);
	} else {
		item.querySelector("input").value = number;
		fetch("/api/checkout/cart/remove", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ bookId: bookId }),
		});
	}
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

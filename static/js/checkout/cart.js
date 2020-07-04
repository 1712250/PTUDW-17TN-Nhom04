function increaseNumber(bookId) {
	const item = document.getElementById(bookId);
	const number = parseInt(item.querySelector("input").value) + 1;
	item.querySelector("input").value = number;
}

function decreaseNumber(bookId) {
	const item = document.getElementById(bookId);
	const number = parseInt(item.querySelector("input").value) - 1;
	if (number == 0) {
		showQuestionModal(
			"Information",
			"Do you want to remove this book from cart?",
			() => {
				fetch("/api/checkout/cart/remove", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ bookId: bookId }),
				}).then((res) => {
					if (res.ok) {
						location.reload();
					}
				});
			}
		);
	} else {
		item.querySelector("input").value = number;
	}
}

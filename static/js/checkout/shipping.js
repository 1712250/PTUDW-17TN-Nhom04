const addressAdding = document.getElementById("addressAdding");
const addressEditing = document.getElementById("addressEditing");

addressAdding.querySelector("form").addEventListener("submit", addAddress);
addressEditing.querySelector("form").addEventListener("submit", updateAddress);

document
	.getElementById("addressAddingControl")
	.addEventListener("click", function (e) {
		e.preventDefault();
		if ($("#addressEditing").is(":visible")) {
			$("#addressEditing").collapse("hide");
			setTimeout(() => {
				$("#addressAdding").collapse("toggle");
			}, 500);
		} else {
			$("#addressAdding").collapse("toggle");
		}
	});

function addAddress(e) {
	e.preventDefault();
	fetch("/api/checkout/shipping/address/add", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			address: {
				receiver: addressAdding.querySelector(".full-name").value,
				phone_number: addressAdding.querySelector(".phone-number")
					.value,
				address: addressAdding.querySelector(".address").value,
			},
			is_default: addressAdding.querySelector("input[type=checkbox]")
				.checked,
		}),
	})
		.then((res) => res.json())
		.then((body) => {
			if (body.status == 200) {
				location.href = "/checkout/payment/" + body.addressId;
			} else {
				showSnackbar("Address already exist!");
			}
		});
}

function updateAddress(e) {
	e.preventDefault();
	fetch("/api/checkout/shipping/address/edit/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			address: {
				_id: addressEditing.querySelector("form").value,
				receiver: addressEditing.querySelector(".full-name").value,
				phone_number: addressEditing.querySelector(".phone-number")
					.value,
				address: addressEditing.querySelector(".address").value,
			},
			is_default: addressEditing.querySelector("input[type=checkbox]")
				.checked,
		}),
	})
		.then((res) => res.json())
		.then((body) => {
			if (body.status == 200) {
				showSnackbar("Address updated!");
				location.reload();
			}
		});
}

// address: object
async function editAddress(address) {
	const addr = JSON.parse(address);
	addressEditing.querySelector("form").value = addr._id;
	addressEditing.querySelector(".full-name").value = addr.receiver;
	addressEditing.querySelector(".phone-number").value = addr.phone_number;
	addressEditing.querySelector(".address").value = addr.address;

	if (
		$("#addressAdding").is(":visible") ||
		$("#addressEditing").is(":visible")
	) {
		$("#addressAdding").collapse("hide");
		$("#addressEditing").collapse("hide");
		setTimeout(() => {
			$("#addressEditing").collapse("show");
		}, 500);
	} else {
		$("#addressEditing").collapse("show");
	}
}

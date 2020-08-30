localStorage.setItem("token", "")

$(document).ready(function () {
  $('#form-submit').on('submit', function (e) {
    e.preventDefault();
    validationLogin()
  });
});
validationLogin = () => {
  var userName = $("#userName").val()
  var password = $("#password").val()
  var headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('Access-Control-Allow-Credentials', 'true');
  headers.append('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI1ZjQ3Y2ExNTQxZDc0ODQzNDQ2NjNlZjIiLCJleHAiOjE1OTg4MTE3MTB9.G-9TxD-3-m0bJjSpGrkkb1cbRhoJO3U1PYu0036LwLQ');
  var url = "https://adminobooks.herokuapp.com/login";

  //console.log(userName +"   "+password)
  var user = {
    username: userName,
    password: password
  }
  var request = new Request(url, {
    body: JSON.stringify(user),
    method: 'POST',
    headers: headers,
  })
  fetch(request)
    .then(res => {
      if (res.status === 200) {
        //alert(res)

        for (var pair of res.headers.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
          window.location.href = "admin-books.html";
        }

        for (var pair of headers.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
      }
    })
}
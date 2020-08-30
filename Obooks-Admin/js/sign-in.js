localStorage.setItem("token", "")
console.log(localStorage.getItem("token"))
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
          return res.json()
      }
    }).then( async res=>{
      data= await res;
      localStorage.setItem("token",data.Authorization)
      window.location.href = "admin-books.html";
    })
}
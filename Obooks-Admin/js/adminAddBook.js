$(document).ready(function() {
    $('#form-submit').on('submit', function(e){
      // validation code here
      $(".modal-body").text(`\"${$("#edittextBook").val()}\" will be created?`)
      $('#exampleModal').modal('show');
        e.preventDefault();
    });
  });
  $(document).ready(function() {
	$(".file-edit-upload").on("change", function() {
		! function(e) {
			if (e.files && e.files[0]) {
                var t = new FileReader;
                console.log(e.files[0])
                
				t.onload = function(e) {
                    $(".profile-pic").attr("src", e.target.result)
                }, t.readAsDataURL(e.files[0])
			}
		}(this)
	}), $(".upload-button").on("click", function() {
		$(".file-edit-upload").click()
	})
})
  submitBook=()=>
  {
      var book={
        bookName: $("#edittextBook").val(),
        bookDescription:$("#editDescription").val(),
        BookAuthorID: "5ef6f3655f377a38235b0eeb",
        bookRate: 0,
        bookIntances: {
            bookPrice: parseInt($("#editPrice").val()),
            bookDiscount: 62,
            bookCount: 7,
            bookSold: 5,
            bookLanguage: "German",
            bookStatus: "Good"
        },
        bookGenres: [
            {
                name: "Crime, Thrillers and Mystery",
                category: $("#selectItemCategory").val()
            }
        ],
        BookGenresID: [
            "5ef6f3655f377a38235b0f98",
            "5ef6f3655f377a38235b0fa2"
        ],
        bookImage: $("#imgBook").attr("src"),
        bookAuthor: $("#editauthor").val()
    }
    console.log(JSON.stringify(book))
      var headers =new Headers();
      var token ="bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI1ZjQ3Y2ExNTQxZDc0ODQzNDQ2NjNlZjIiLCJleHAiOjE1OTg3OTExMDN9.-6Y5wmV3HxczytbqQIMZZ-jEHUgNLKwjCAcHyCYMs-k"
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Access-Control-Allow-Credentials', 'true');
      headers.append("Authorization",token)
      var url ="https://adminobooks.herokuapp.com/book";
      var request = new Request(
          url,{
              body : JSON.stringify(book),
              method: 'POST',
              headers: headers,
              mode: 'cors'
          }
      )
      fetch(request)
      .then(res=>
        {
            if(res,status===401)
            {
                window.location.href="sign-in.html";
            }
            if(res.status===200)
            {
                console.log("Successfully")
                $('#exampleModal').modal('hide');
                window.location.href="admin-books.html";
            }
            else 
            {
                alert("Failure")
            }
            $('#exampleModal').modal('hide');
        }
      )
  }
$(document).ready(function() {
	$(".file-edit-upload").on("change", function() {
		! function(e) {
			if (e.files && e.files[0]) {
                var t = new FileReader;
                console.log(e.files[0])
                
				t.onload = function(e) {
                    $(".profile-pic").attr("src", e.target.result)
                }, t.readAsDataURL(e.files[0])
                var text="";
                var t2 = new FileReader;
                const fs = require('fs') 
			}
		}(this)
	}), $(".upload-button").on("click", function() {
		$(".file-edit-upload").click()
	})
})

var book;
var headers =new Headers();
var token =localStorage.getItem("token")
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
headers.append('Access-Control-Allow-Origin', '*');
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append("Authorization",token)
var idBook =localStorage.getItem("dataIdBook")
var url ="https://adminobooks.herokuapp.com/book/"+idBook
var request = new Request(
    url,{
        method: 'GET',
        headers: headers,
        mode: 'cors'
    }
)
renderData=()=>
{
    $(".profile-pic").attr("src",book.bookImage.includes("data:")?book.bookImage:"images/iconBook/"+book.bookImage)
    $("#edittextBook").val(book.bookName)
    $("#editauthor").val(book.bookAuthor)
    $("#editDescription").text(book.bookDescription);
    $("#editPrice").val(book.bookIntances.bookPrice);
}
fetch(request)
.then(res =>{
    if(res.status===401)
    {
        window.location.href="sign-in.html";
    }
    else if(res.status) {return res.json()}})
.then(async res=>
    {
        book= await res;
        renderData()
    })

$(document).ready(function() {
$('#form-submit').on('submit', function(e){
    // validation code here
    $(".modal-body").text(`\"${book.bookName}\" will be change?`)
    $('#exampleModal').modal('show');
    e.preventDefault();
});
});
submitBook=()=>
{   
    var img =$(".profile-pic").attr("src")
    if(img.includes("data:"))
    {
    book.bookImage=$(".profile-pic").attr("src")
    }
    book.bookName=$("#edittextBook").val()
    book.bookAuthor= $("#editauthor").val()
    book.bookDescription=$("#editDescription").val()
    book.bookIntances.bookPrice=parseInt($("#editPrice").val())
 
    var Updaterequests = new Request(
       url,{
           body: JSON.stringify(book),
           method: 'PUT',
           headers: headers,
           mode: 'cors'
       }
   )
   
    fetch(Updaterequests).then(res=>
       {
           if(res.status===200)
           {
 
               console.log("Successfull");
               window.location.href="admin-books.html";
           }
           
           else
           {
 
               console.log(res)
               window.location.href="sign-in.html";
           }
           $('#exampleModal').modal('hide');
       })
   
}
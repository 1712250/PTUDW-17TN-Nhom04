$(document).ready(function() {
    $('#form-submit').on('submit', function(e){
      // validation code here
      $(".modal-body").text(`\"${$("#nameCategory").val()}\" will be created?`)
      $('#exampleModal').modal('show');
        e.preventDefault();
    });
  });
  submitCategory=()=>
  {
      var category={
        category: $("#nameCategory").val(),
        categoryName:$("#descCategory").val()
      }
      var headers =new Headers();
      var token =localStorage.getItem("token")
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Access-Control-Allow-Credentials', 'true');
      headers.append("Authorization",token)
      var url ="https://adminobooks.herokuapp.com/category";
      var request = new Request(
          url,{
              body : JSON.stringify(category),
              method: 'POST',
              headers: headers,
              mode: 'cors'
          }
      )
      fetch(request)
      .then(res=>
        {
            if(res.status===401)
            {
                window.location.href="sign-in.html";
            }
            if(res.status===200)
            {
                $('#exampleModal').modal('hide');
                window.location.href="admin-category.html";
            }
            else
            {
              window.location.href="sign-in.html";
            }
            $('#exampleModal').modal('hide');
        }
      )
  }
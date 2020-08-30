
    var name =localStorage.getItem("nameCategory");
    var desc =localStorage.getItem("descCategory");
    $("#nameCategory").val(name)
    $("#descCategory").text(desc);
    var category;
    var headers =new Headers();
    var token ="bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI1ZjQ3Y2ExNTQxZDc0ODQzNDQ2NjNlZjIiLCJleHAiOjE1OTg3OTExMDN9.-6Y5wmV3HxczytbqQIMZZ-jEHUgNLKwjCAcHyCYMs-k"
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append("Authorization",token)
    var url ="https://adminobooks.herokuapp.com/category/"+localStorage.getItem("idCategory")
    var request = new Request(
        url,{
            method: 'GET',
            headers: headers,
            mode: 'cors'
        }
    )
    fetch(request)
    .then(async res=>
        {
            if(res.status!=401)
            {return res.json()}
        })
    .then(async res=>
        {
           category =await res
        }

    )
    submitCategory=()=>
    {
         category.category=$("#nameCategory").val()
         category.categoryName=$("#descCategory").val()
         var requests = new Request(
            url,{
                body: JSON.stringify(category),
                method: 'PUT',
                headers: headers,
                mode: 'cors'
            }
        )
         fetch(requests).then(res=>
            {
                if(res,status===401)
                {
                    window.location.href="sign-in.html";
                }
                if(res.status===200)
                {
                    console.log("Successfull");
                    $('#exampleModal').modal('hide');
                    window.location.href="admin-category.html";
                }
                else
                {
                    console.log(requests)
                }
            })
        
    }
 
    $(document).ready(function() {
        $('#form-submit').on('submit', function(e){
          // validation code here
          $(".modal-body").text(`\"${category.categoryName}\" will be change?`)
          $('#exampleModal').modal('show');
            e.preventDefault();
        });
      });

    
 
var headers =new Headers();
var token ="bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI1ZjQ3Y2ExNTQxZDc0ODQzNDQ2NjNlZjIiLCJleHAiOjE1OTg3OTExMDN9.-6Y5wmV3HxczytbqQIMZZ-jEHUgNLKwjCAcHyCYMs-k"
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
headers.append('Access-Control-Allow-Origin', '*');
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append("Authorization",token)

var url ="https://adminobooks.herokuapp.com/book"
var idxpage =-1;
var request = new Request(
    url,{
        method: 'GET',
        headers: headers,
        mode: 'cors'
    }
)
var data=[]
renderData= (page)=>
{
    var pages =$(".index-page");
    pages.text(page)
    var parent = document.getElementById("tbodyTable")
    parent.innerHTML=""
    console.log("    "+data.length)
    for (var id=page*10; id<(page+1)*10;id++)
    {
        element=data[id]
        parent.insertAdjacentHTML( 'beforeend',template(element,id));
    }
}
var template =(element,id)=>
{
    var imgbook= element.bookImage.includes("data:")?element.bookImage:"images/iconBook/"+element.bookImage;
    console.log(imgbook)
return `
        <tr data-idbook=${element.idBook}>
        <td>${id+1}</td>
        <td><img class="img-fluid rounded" src="${imgbook}" alt=""></td>
        <td class="bookName" id="bookName">${element.bookName}</td>
        <td>Jhone Steben</td>
        <td>
        <p class="mb-0">${element.bookDescription}</p>
        </td>                                     
        <td>
        <div class="flex align-items-center list-user-action">
        <a class="bg-primary" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit" onclick="editBook(event)"  ><i class="ri-pencil-line"></i></a>
        <a class="bg-primary" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete" onclick="deleteBook(event)" href="#"><i class="ri-delete-bin-line"></i></a>
        </div>
        </td>
        </tr>`
}

fetch(request)
.then(async res => {
    if(res,status===401)
    {
        window.location.href="sign-in.html";
    }
    if (res.status !== 401) {
         let response = await res.json()
         return response
    } else {
        return Promise.reject(res.status);
    }
})
.then( async res=>
    {
        data=await res
        $(".paging-data").show()
        var id=0;
        idxpage++;
        renderData(idxpage)
    })
.catch(error=>
    {
       console.log(error)  
    });


nextPage= ()=>
{
    if(idxpage+1<(Math.ceil(data.length/10)))
    {
        idxpage++;
        renderData(idxpage)
    }
}
prevPage= ()=>
{
    if(idxpage>=1)
    {
        idxpage--;
        renderData(idxpage)
    }
}
editBook=(event)=>
{
    var node =event.target.parentNode.parentNode.parentNode.parentNode;
 
    var idBook= node.getAttribute("data-idbook");
    console.log(idBook)
    localStorage.setItem("dataIdBook", idBook);
    window.location.href="admin-edit-book.html";
}
var deleteBook=(event)=>
{
    var node =event.target.parentNode.parentNode.parentNode.parentNode;
    currentNode=node;
    $(".modal-body").text(`\"${desc=$(node).find("#bookName").text()}\" will be removed?`)
    $(".modal-body").attr("data-idbook",node.getAttribute("data-idbook"));
    $('#exampleModal').modal('show');
    
    
}
removeBook=(event)=>
{
    var index= $(".modal-body").attr("data-idbook");
    $('#exampleModal').modal('hide');
    var delRequest = new Request(
    url+`/${index}`,{
        method: 'DELETE',
        headers: headers,
        mode: 'cors'
    })
    currentNode.remove();
    ('#exampleModal').modal('hide');
    /*if(currentNode!==null)
    {fetch(delRequest)
    .then(res=>
        {
            if(res.status===200)
            {
                console.log("OK");
                currentNode.remove();
            }
        })
    }
    $('#exampleModal').modal('hide');*/

    
}
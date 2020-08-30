var headers =new Headers();
var token =localStorage.getItem("token")
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
headers.append('Access-Control-Allow-Origin', '*');
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append("Authorization",token)

var url ="https://adminobooks.herokuapp.com/category"
var idxpage =-1;
var data=[]
var currentNode=null;
var request = new Request(
    url,{
        method: 'GET',
        headers: headers,
        mode: 'cors'
    }
)
renderPage= (page)=>
{
    var pages =$(".index-page");
    pages.text(page)
    var parent = document.getElementById("tableCategory")
    parent.innerHTML=""
    for (var id=page*10; id<(page+1)*10;id++)
    {
        element=data[id]
        parent.insertAdjacentHTML( 'beforeend',template(element,id));
    }
}
template =(element,id)=>
{
    return `
    <tr data-index=${element.idCategory}>
    <td>${id+1}</td>
    <td id="nameCategory">${element.category}</td>
    <td>
      <p id="descCategory" class="mb-0">${element.categoryName}</p>
    </td>
    <td>
       <div class="flex align-items-center list-user-action">
         <a class="bg-primary" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit" href="#" onclick="onclickEdit(event)"><i class="ri-pencil-line"></i></a>
         <a class="bg-primary" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete" href="#" onclick="onclickDelete(event)"><i class="ri-delete-bin-line"></i></a>
      </div>
    </td>
</tr>`
}
fetch(url,request)
.then(res =>
    {
        if(res.status===401)
        {
            window.location.href="sign-in.html";
        }
        if(res.status !=401)
        {
            return res.json()
        }
        else 
        {
            return [{}]
        }
    }
)
.then( async res=>
    {
        data=await res
        $(".paging-data").show()
        idxpage++;
        renderPage(idxpage)
    }

)

var onclickDelete=(event)=>
{
    var node =event.target.parentNode.parentNode.parentNode.parentNode;
 
    currentNode=node;
    $(".modal-body").text(`\"${desc=$(node).find("#nameCategory").text()}\" will be removed?`)
    $(".modal-body").attr("data-index",node.getAttribute("data-index"));
    $('#exampleModal').modal('show');
    
    
}
removeCategory=(event)=>
{
    var index= $(".modal-body").attr("data-index");
     
    var delRequest = new Request(
    url+`/${index}`,{
        method: 'DELETE',
        headers: headers,
        mode: 'cors'
    })
    if(currentNode!==null)
    {fetch(delRequest)
    .then(res=>
        {
            if(res.status===401)
            {
                window.location.href="sign-in.html";
            }
            if(res.status===200)
            {
                console.log("OK");
                currentNode.remove();
            }
            else{
                window.location.href="sign-in.html";
            }
        })
    }
    $('#exampleModal').modal('hide');

    
}
var onclickEdit=(event)=>
{
    var node =event.target.parentNode.parentNode.parentNode.parentNode;
    var desc=$(node).find("#descCategory")
    var name=$(node).find("#nameCategory")
    var idCategory =node.getAttribute("data-index");
    localStorage.setItem("nameCategory", name.text());
    localStorage.setItem("descCategory", desc.text());
    localStorage.setItem("idCategory",idCategory);
    window.location.href="admin-edit-category.html";
}

nextPage= ()=>
{
    if(idxpage+1<(Math.ceil(data.length/10)))
    {
        idxpage++;
        renderPage(idxpage)
    }
}
prevPage= ()=>
{
    if(idxpage>=1)
    {
        idxpage--;
        renderPage(idxpage)
    }
}
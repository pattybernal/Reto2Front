const createGadget = () => {
    const id = $("#gId").val().trim();
    const brand = $('#brand').val().trim();
    const category = $('#category').val().trim();
    const name = $('#gName').val().trim();
    const description = $('#description').val().trim();
    const price = $("#price").val().trim();
    const availability = $("#availability").val().trim();
    const quantity = $("#quantity").val().trim();
    const photography = $("#image").val().trim();

    const data = {
        id: id, brand: brand, category:category,name:name,description:description, 
        price: price, availability: availability, quantity:quantity, 
        photography:photography
    };

    if(verifyEmpty(data)){
        $.ajax({
            url: `${urlGadget}/all`,
            type: 'GET',
            dataType: 'json',
            success: function (respuesta){
                for(let i=0;i<respuesta.length;i++){
                    if(respuesta[i].id==id){
                        mostrarMensaje('Error','el Id ya existe!',true);
                    }
                }        
            }
        });
        $.ajax({
                url: `${urlGadget}/new`,
                type: "POST",
                dataType: 'JSON',
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(data),
                statusCode: {
                    201: function () {
                        mostrarMensaje('Confirmación', 'Gadget creada de Forma correcta!');
                        clearFormGadget();
                        setTimeout(()=>{
                            window.location.href="menu2.html"
                        },1000);
                    }
                },
                error: function (xhr, status) {
                    $("#loading").html("");
                    console.log(xhr);
                    console.log(status);
                    mostrarMensaje('Error', 'Error al validar', true);
                }
            });
    }        
}
const cargue = () =>{
    $.ajax({
        url: `${urlGadget}/all`,
        type: "GET",
        datatype: "JSON",
        success: function(response){
            mostrarTablaGadget(response);
        } 
    });
}

const mostrarTablaGadget= (items) =>{
    let tableGadget = "<table class ='table table-striped table-info'>";
    tableGadget+="<tr>";
        tableGadget+="<th>BRAND</th>";
        tableGadget+="<th>CATEGORY</th>";
        tableGadget+="<th>NAME</th>";
        tableGadget+="<th>DESCRIPTION</th>";
        tableGadget+="<th>PRICE</th>";
        tableGadget+="<th>AVAILABILITY</th>";
        tableGadget+="<th>QUANTITY</th>";
        tableGadget+="<th>PHOTOGRAPHY</th>";
        tableGadget+="<th colspan='2'>ACTIONS</th>";
        tableGadget+="</tr>";
        for(i=0;i<items.length;i++){
                tableGadget+="<tr>";
                tableGadget+="<td>"+items[i].brand+"</td>";
                tableGadget+="<td>"+items[i].category+"</td>";
                tableGadget+="<td>"+items[i].name+"</td>";
                tableGadget+="<td>"+items[i].description+"</td>";
                tableGadget+="<td>"+items[i].price+"</td>";
                tableGadget+="<td>"+items[i].availability+"</td>";
                tableGadget+="<td>"+items[i].quantity+"</td>";
                tableGadget+="<td>"+items[i].photography+"</td>";
                tableGadget+="<td> <button onclick= 'clearItemGadget("+items[i].id+")' class='btn btn-info'>Borrar</button></td>";
                tableGadget+="<td> <button onclick= 'itemByIDGadget("+items[i].id+")' class='btn btn-info'>Editar</button></td>";
                tableGadget+="</tr>";
        }
        tableGadget+="</table>";
        $("#tableGadget").append(tableGadget);
}
const itemByIDGadget = (idItem) =>{
    $.ajax({
        url:`${urlGadget}/${idItem}`,
        type:"GET",
        dataType:"JSON",
        success:function(respuesta){
            $('#gId').val(respuesta.id);
            $('#brand').val(respuesta.brand);
            $('#category').val(respuesta.category);
            $('#gName').val(respuesta.name);
            $('#description').val(respuesta.description);
            $('#price').val(respuesta.price);
            $("#availability").val(respuesta.availability.toString());
            $("#quantity").val(respuesta.quantity);
            $("#image").val(respuesta.photography);                        
        }
});
    $("#updateGadget").prop("hidden", false);
}

const clearItemGadget = (dataId) =>{
    $.ajax({
        url: `${urlGadget}/${dataId}`,
        type: "DELETE",
        data: JSON.stringify(dataId),
        datatype: "JSON",
        contentType: "application/JSON; charsert=utf-8",
        statusCode: {
            204: function () {
                mostrarMensaje('Confirmación', 'El Gadget de eliminó con exito!');
                $("#tableGadget").empty();
                cargue();
            }
        }
    });
}

const clearFormGadget = () =>{
    $('#brand').val("");
    $('#category').val("");
    $('#gName').val("");
    $('#description').val("");
    $("#price").val("");
    $("#availability").val("");
    $("#quantity").val("");
    $("#image").val("");  
}

const updateGadget = () =>{
    let data ={
        id: $('#gId').val(),
        brand: $('#brand').val(),
        category:$('#category').val(),
        name: $('#gName').val(),
        description: $('#description').val(),
        price: $("#price").val(),
        availability: $("#availability").val(),
        quantity: $("#quantity").val(),
        photography: $("#image").val(), 
    }
    //console.log(data);
    if(verifyEmpty(data)){
        $.ajax({
            url: `${urlGadget}/update`,
            type: "PUT",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            dataType: "json",
            statusCode: {
            201: function (){
                mostrarMensaje('Confirmación', 'Gadget actualizado con exito!')
                $("#updateGadget").prop("hidden", true);
                $("#tableGadget").empty();
                cargue();
            }
        }
    });
}  
}

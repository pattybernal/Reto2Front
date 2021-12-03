const urlUser= 'http://localhost:8080/api/user';

const createUser = () => {
    //document.getElementById('txtNombre').value;
    const id = $("#txtId").val();
    const identification = $('#txtIdentifica').val();
    const name = $('#txtNombre').val();
    const address = $('#txtDir').val();
    const cellPhone = $('#txtCell').val();
    const email = $("#txtEmail").val();
    const password = $("#txtClave").val();
    const confirmar = $("#txtConfirmarClave").val();
    const zone = $("#txtZone").val();
    const type = $("#txtType").val(); 
    
    $.ajax({
        url: `${urlUser}/all`,
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
    //console.log(identification.length<8);
    if(identification.length < 8 || identification.length > 10){
        mostrarMensaje('Error','Digite una identificación válida',true);
        return;
    }else if (password !== confirmar) {
        mostrarMensaje('Error', 'Las claves no coinciden', true);
        return;
    } else if (password.length < 6) {
        mostrarMensaje('Error', 'La clave debe tener minimo 6 caracteres', true);
        return;
    }else if(cellPhone.length<10 || cellPhone.length > 10){
        mostrarMensaje('Error', 'digite un número de celular válido', true);
    }

    const data = {
        id:id,
        identification: identification,
        name: name,
        address: address,
        cellPhone: cellPhone,
        email:  email,
        password: password,
        zone: zone,
        type:   type
    };

    $.ajax({
        url: `${urlUser}/${email}/${password}`,
        type: 'GET',
        dataType: 'json',
        success: function (respuesta){
            console.log(respuesta.id)
            if(respuesta.id !== null){
                mostrarMensaje('Error', 'No es posible crear la cuenta, usuario y email ya existen', true);
                return;
            }else {
                $.ajax({
                    url: `${urlUser}/emailexist/${email}`,
                    type: 'GET',
                    dataType: 'json',
                    success: function(response){
                        console.log(response)
                        if(response){
                            mostrarMensaje('Error','el e-mail ya existe!', true);
                            return;
                        }else{
                            $.ajax({
                                url: `${urlUser}/new`,
                                type: "POST",
                                dataType: 'json',
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                data: JSON.stringify(data),
                                statusCode: {
                                    201: function () {
                                        mostrarMensaje('Confirmación', 'Cuenta creada de Forma correcta!');
                                        clearFormUser();
                                        //alert('Empresa Creada');
                                    }
                                }
                            });
                        }
                    }
                });
               
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

const mostrarMensaje = (titulo, cuerpo, error) => {
    //console.log("error",error);
    //document.getElementById("titulomensaje").innerHTML = titulo;
    $("#titulomensaje").html(titulo)
    $("#cuerpomensaje").html(cuerpo);
    $("#myToast").removeClass();
    if (error) {
        $("#myToast").addClass("toast bg-danger")
    } else {
        $("#myToast").addClass("toast bg-success")
    }

    $("#myToast").toast("show");
}

const iniciarSesion = () => {
    const loading = '<img src="images/spinner.gif">';
    $("#loading").html(loading);

    setTimeout(()=>{
        autenticar();
    }, 1000);
}

const autenticar = ()=>{
    const email = $("#txtEmail").val().trim();
    const password = $("#txtPassword").val().trim();

    if (email.length === 0 || password.length === 0) {
        mostrarMensaje('Error', 'Debe escribir el email y la contraseña para ingresar', true);
        $("#loading").html("");
        return;
    }else if(!verifyEmail(email)){
        mostrarMensaje('Error', 'Ingrese un e-mail válido', true)
        return;
    }

    $.ajax({
        url: `${urlUser}/${email}/${password}`,
        type: 'GET',
        dataType: 'json',
        success: function (respuesta) {
            $("#loading").html("");
            console.log(respuesta);
            if (respuesta.id===null){
                mostrarMensaje('Error - usuario y/o contraseña erroneos', 'Usuario No existe', true);
            }else{
                mostrarMensaje('Bienvenid@', `${respuesta.name}`);

                setTimeout(()=>{
                    if(respuesta.type==="ADM"){
                        window.location.href = 'menu.html';
                    }else if(respuesta.type==="ASE" || respuesta.type==="COORD"){
                        window.location.href = 'menu2.html';
                    }else{
                        mostrarMensaje('Error', 'Usuario no Definido',true);
                    }
                }, 1000);
                
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

const verifyEmail = (valor) => {
    let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (emailRegex.test(valor)) {
        return true;
    } else {
        return false;
    }
}
const welcome = () =>{
    $.ajax({
        url: `${urlUser}/all`,
        type: "GET",
        datatype: "JSON",
        success: function(response){
            mostrarTablaUser(response);
        } 
    });
}
const mostrarTablaUser = (items) =>{
    let tableUser = "<table class ='table table-striped table-info'>";
    tableUser+="<tr>";
        tableUser+="<th>IDENTIFICATION</th>";
        tableUser+="<th>NAME</th>";
        tableUser+="<th>ADDRESS</th>";
        tableUser+="<th>CELLPHONE</th>";
        tableUser+="<th>EMAIL</th>";
        tableUser+="<th>PASSWORD</th>";
        tableUser+="<th>ZONE</th>";
        tableUser+="<th>TYPE</th>";
        tableUser+="<th colspan='2'>ACTIONS</th>";
        tableUser+="</tr>";
        for(i=0;i<items.length;i++){
                tableUser+="<tr>";
                tableUser+="<td>"+items[i].identification+"</td>";
                tableUser+="<td>"+items[i].name+"</td>";
                tableUser+="<td>"+items[i].address+"</td>";
                tableUser+="<td>"+items[i].cellPhone+"</td>";
                tableUser+="<td>"+items[i].email+"</td>";
                tableUser+="<td>"+items[i].password+"</td>";
                tableUser+="<td>"+items[i].zone+"</td>";
                tableUser+="<td>"+items[i].type+"</td>";
                tableUser+="<td> <button onclick= 'clearItem("+items[i].id+")' class='btn btn-info'>Borrar</button></td>";
                tableUser+="<td> <button onclick= 'itemByID("+items[i].id+")' class='btn btn-info'>Editar</button></td>";
                tableUser+="</tr>";
        }
        tableUser+="</table>";
        $("#tableUser").append(tableUser);
}

const clearItem = (dataId) =>{
    $.ajax({
        url: `${urlUser}/${dataId}`,
        type: "DELETE",
        data: JSON.stringify(dataId),
        datatype: "JSON",
        contentType: "application/JSON; charsert=utf-8",
        statusCode: {
            204: function () {
                mostrarMensaje('Confirmación', 'El Usuario de eliminó con exito!');
                $("#tableUser").empty();
                welcome();
            }
        }
    });
}
const clearFormUser = () =>{
    $("#txtId").val("");
    $('#txtIdentifica').val("");
    $('#txtNombre').val("");
    $('#txtDir').val("");
    $('#txtCell').val("");
    $("#txtEmail").val("");
    $("#txtClave").val("");
    $("#txtConfirmarClave").val("");
    $("#txtZone").val("");
    $("#txtType").val("");  
}

const itemByID = (idItem) =>{
    $.ajax({
        url:`${urlUser}/${idItem}`,
        type:"GET",
        dataType:"JSON",
        success:function(respuesta){
            $('#id').val(respuesta.id);
            $('#identification').val(respuesta.identification);
            $('#name').val(respuesta.name);
            $('#address').val(respuesta.address);
            $('#cellPhone').val(respuesta.cellPhone);
            $("#email").val(respuesta.email);
            $("#password").val(respuesta.password);
            $("#zone").val(respuesta.zone);
            $("#type").val(respuesta.type);                        
        }
});
    $("#updateUser").prop("hidden", false);
    //$("#updateUser").prop("hidden", true);
}
const update = () =>{
    let data ={
        id: $('#id').val().trim(),
        identification: $('#identification').val().trim(),
        name:$('#name').val().trim(),
        address: $('#address').val().trim(),
        cellPhone: $('#cellPhone').val().trim(),
        email: $("#email").val().trim(),
        password: $("#password").val().trim(),
        zone: $("#zone").val().trim(),
        type: $("#type").val().trim(), 
    };
    if (verifyEmpty(data)){
        $.ajax({
            url: `${urlUser}/update`,
            type: "PUT",
            data: JSON.stringify(data),
            dataType: "JSON",
            contentType: "application/JSON; charsert=utf-8",
            statusCode: {
            201: function (){
                //console.log(data);
                mostrarMensaje('Confirmación', 'Usuario actualizado con exito!')
                $("#updateUser").prop("hidden", true);
                $("#tableUser").empty();
                welcome();
            }
        }
        });
    }  
}
const verifyEmpty = (data) =>{
    for (const [key, value] of Object.entries(data)){
        if(value.length < 1){
            mostrarMensaje('Error', 'Campo vacio', true)
            return false;
        }
    }return true;
}
const clearUpdateForm = () =>{
    $('#id').val("");
    $('#identification').val("");
    $('#name').val("");
    $('#address').val("");
    $('#cellPhone').val("");
    $("#email").val("");
    $("#password").val("");
    $("#zone").val("");
    $("#type").val("");  
}
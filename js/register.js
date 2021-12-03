$("#login").click(function(){
    if($.trim($("#email").val()) == "" || $.trim($("#password").val()) == ""){
        alert("Por favor ingrese el correo y la contraseña");
    }else{
        let datos = {
            email: $("#email").val(),
            contrasena: $("#password").val(),
            
        }
        $.ajax({
            url:"http://152.67.253.190:8080/api/User/"+datos.email+"/"+datos.contrasena,
            method:"GET",
            dataType:"json",
            success:function(response){
                console.log(response);
                validarUsuario(response);
            }
        });
    }
}); 

function validarUsuario(response) {
    if(response.id != null){
        location.href = "index.html";
        alert("Bienvenido " + response.name);
    }else{
        alert("Usuario no registrado");
    }
}

$("#guardar").click(function(){
    if($.trim($("#emailRegistro").val()) == "" || $.trim($("#usuarioRegistro").val()) == "" || $.trim($("#contrasenaRegistro").val()) == "" || $.trim($("#contrasenaRegistro2").val()) == ""){
        alert("Por favor ingrese todos los campos");
    }else{
        if($("#contrasenaRegistro").val() == $("#contrasenaRegistro2").val()){
            let datos = {
                email: $("#emailRegistro").val(),
                password: $("#contrasenaRegistro").val(),
                name: $("#usuarioRegistro").val()
            }
            $.ajax({
                url:"http://localhost:8080/api/User/new",
                method:"POST",
                dataType:"json",
                data:JSON.stringify(datos),
                contentType:"application/json",
                Headers:{
                    "Content-Type":"application/json"
                },
                statusCode: {
                    201: function(response){
                        console.log(response);
                        alert("Registrado Correctamente");
                    }
                }
            });
        }else{
            alert("Las contraseñas no coinciden");
        }
    }
});
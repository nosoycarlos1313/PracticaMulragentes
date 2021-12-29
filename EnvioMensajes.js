/*
    Autores:
    Diego Irnan Martinez
*/

//Funcion JQuery ajax para mandar mensajes y recibir respuesta
function enviarXML(infoMensaje){
    var respuesta;
    var mensaje = crearMensaje(infoMensaje);

    $.ajax({
        url: 'http://' + infoMensaje.ip_receptor + ":"+infoMensaje.puerto_receptor,
        data: mensaje,
        type: 'POST',
        async: false,
        // dataType: 'text',
        // contentType: 'text/xml',

        beforeSend: function(request){
            //TODO: Actualizar html
            // console.log("Envio mensaje a: "+infoMensaje.ip_receptor);
            // console.log(mensaje)
        },

        // Recepcion del mensaje
        success: function(response){
            console.log("Mensaje recibido de: "+infoMensaje.ip_receptor);
            console.log(response)
            respuesta = leerXML(response);
            console.log("Mensaje recibido de "+infoMensaje.ip_receptor+" procesado");
        },

        // En caso de error
        error: function(response){
            console.log("Error enviando a "+ infoMensaje.ip_receptor +": "+response);

            respuesta = -1;
            //TODO: Actualizar html con error
        }
    });

    return respuesta;
}

function get_Monitor(ip_monitor){
    // https://www.w3schools.com/jquery/ajax_get.asp
    var respuesta;
    $.ajax({
        url: 'http://' + ip_monitor + ":3000?crearCliente",
        // data: ip_cliente,
        type: "GET",
        async: false,
        datatype: "text",
        contentType: "text",

        success: function(data){
            console.log("Conexion realizada con el Monitor");
            console.log(data);
            respuesta = leerXML(data);
        },

        error: function(response) {
            console.log("No se pudo conectar con el Monitor");
            repuesta = -1;
        }
    });
    return respuesta;
}
/*
    Autores:
    Diego Irnan Martinez
*/

//Vamos a generar la cabecera de un mensaje XML para enviar
function cabeceraMensaje(infoMensaje){
    return  "<head>" +                                     //Devolvemos la cabecera mas:
                "<tipo_mensaje>" + infoMensaje.tipo_mensaje + "</tipo_mensaje>" +

                "<tipo_emisor>" + 'comprador' + "</tipo_emisor>" +

                "<id_emisor>" + infoMensaje.id_emisor + "</id_emisor>" +

                "<ip_emisor>" + infoMensaje.ip_emisor + "</ip_emisor>" +

                "<puerto_emisor>" + '-1' + "</puerto_emisor>" +

                "<tipo_receptor>" + infoMensaje.tipo_receptor + "</tipo_receptor>" +

                "<id_receptor>" + infoMensaje.id_receptor + "</id_receptor>" +

                "<ip_receptor>" + infoMensaje.ip_receptor + "</ip_receptor>" +

                "<puerto_receptor>" + infoMensaje.puerto_receptor + "</puerto_receptor>" +

                "<time_sent>" + getTime() + "</time_sent>" +

            "</head>";
}

//En funcion del tipo, genera el cuerpo del mensaje XML
function cuerpoMensaje(infoMensaje){

    var mensaje = "<body xsi:type=\""+infoMensaje.tipo_mensaje+"\">";  

    switch (infoMensaje.tipo_mensaje){                                        
        case 'alta':
            mensaje += cabeceraMensaje(infoMensaje);
            //mensaje += cabeceraAltaMensaje(infoMensaje);
            break;
       
        case 'inicio_actividad':  //FALTA POR HACER
            break;

        case 'entrada_tienda':  //emisor, receptor, infor_msg
            mensaje += entrarTienda(infoMensaje); 
            break;

        case 'compra':
            mensaje += cabeceraMensaje(infoMensaje) + lista_productos(infoMensaje);
            //mensaje += cabeceraCompraMensaje(infoMensaje);
            break;

        case 'compra':
            mensaje += cabeceraMensaje(infoMensaje) + lista_productos(infoMensaje);
            //mensaje += cabeceraCompraMensaje(infoMensaje);
            break;

        case 'solicitar_tiendas':  //FALTA POR HACER
            break;
        
        case 'salida_tienda':
            mensaje += salirTienda(infoMensaje); //emisor, receptor
            break;
    
        case 'finalizacion':
            mensaje += finObjetivo(infoMensaje); //FALTA POR HACER
            break;
        
        default:
            console.log('Error: ' + infoMensaje.tipo_mensaje);
            break;
    }

    return mensaje + "</body>";
}

// Se crea el mensaje XML completo
function crearMensaje(infoMensaje){

    //TODO: Cambiar modelo de mensaje cuando se tenga el completo
    mensaje="<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + '<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation=\"TodosMensajes.xsd\">' +
                cuerpoMensaje(infoMensaje)+
            "</root>";

    return mensaje
    // parser = new DOMParser();
    // return parser.parseFromString(mensaje,"text/xml");
}

//Obtiene la hora actual (LUNA)
function getTime(){
    var date = new Date();
    var hours = addZero(date.getHours());
    var minutes = addZero(date.getMinutes());
    var seconds = addZero(date.getSeconds());

    var time = hours + ":" + minutes + ":" + seconds;
    return time;
}

//Funcion para añadir ceros a la izquierda en caso necesario para la fecha y la hora (LUNA)
function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

/*FUNCIONES DE LOS DISTINTOS MENSAJES*/

function escribir_productos(infoMensaje){
    var mensajes = "<lista_productos>";
        for(let i=0; i<infoMensaje.productos.length; i++){
            mensajes += "<producto>" +
                        "<id_producto>" + infoMensaje.productos[i].id + "</id_producto>"+

                        "<cantidad>"+ infoMensaje.productos[i].cantidad + "</cantidad>"+
                    "</producto>";
        }
    return mensajes +="</lista_productos>";
    
}

function cabeceraAltaMensaje(infoMensaje){
    return  "<head>" +                                 
                "<id_emisor>" + infoMensaje.id_emisor + "</id_emisor>" +

                "<ip_emisor>" + infoMensaje.ip_emisor + "</ip_emisor>" +

                "<tipo_emisor>" + 'comprador' + "</tipo_emisor>" +

                "<tipo_receptor>" + infoMensaje.tipo_receptor + "</tipo_receptor>" +

                "<id_receptor>" + infoMensaje.id_receptor + "</id_receptor>" +

                "<ip_receptor>" + infoMensaje.ip_receptor + "</ip_receptor>" +

                "<contador>" + '0' + "</contador>" +

                "<protocolo>" + 'alta' + "</protocolo>" +

                "<tipo_mensaje>" + 'MSI' + "</tipo_mensaje>"

            "</head>";
}

function cabeceraCompraMensaje(infoMensaje){
    return  "<head>" +                                 
                "<id_emisor>" + infoMensaje.id_emisor + "</id_emisor>" +

                "<ip_emisor>" + infoMensaje.ip_emisor + "</ip_emisor>" +

                "<tipo_emisor>" + 'comprador' + "</tipo_emisor>" +

                "<puerto_emisor" + infoMensaje.puerto_emisor + "</puerto_emisor" +

                "<tipo_receptor>" + infoMensaje.tipo_receptor + "</tipo_receptor>" +

                "<id_receptor>" + infoMensaje.id_receptor + "</id_receptor>" +

                "<ip_receptor>" + infoMensaje.ip_receptor + "</ip_receptor>" +

                "<puerto_receptor" + infoMensaje.puerto_receptor + "</puerto_receptor" +

                "<id_mensaje>" + '0' + "</id_mensaje>" +

                "<cuerpo>" + lista_productos + "</protocolo>" +

                "<tipo_mensaje>" + 'MSIP' + "</tipo_mensaje>" +

            "</head>";
}

function entrarTienda(infoMensaje){
    return  "<head>" +                                 
                "<id_emisor>" + infoMensaje.id_emisor + "</id_emisor>" +

                "<ip_emisor>" + infoMensaje.ip_emisor + "</ip_emisor>" +

                "<tipo_emisor>" + 'comprador' + "</tipo_emisor>" +

                "<tipo_receptor>" + infoMensaje.tipo_receptor + "</tipo_receptor>" +

                "<id_receptor>" + infoMensaje.id_receptor + "</id_receptor>" +

                "<ip_receptor>" + infoMensaje.ip_receptor + "</ip_receptor>" +

                "<tipo_mensaje>" + 'MSET' + "</tipo_mensaje>" +

                "<hora>" + getTime() + "<hora>" +

            "</head>";
}

function salirTienda(infoMensaje){
    return  "<head>" +                                 
                "<id_emisor>" + infoMensaje.id_emisor + "</id_emisor>" +

                "<ip_emisor>" + infoMensaje.ip_emisor + "</ip_emisor>" +

                "<tipo_receptor>" + infoMensaje.tipo_receptor + "</tipo_receptor>" +

                "<id_receptor>" + infoMensaje.id_receptor + "</id_receptor>" +

                "<ip_receptor>" + infoMensaje.ip_receptor + "</ip_receptor>" +

                "<tipo_mensaje>" + 'MSST' + "</tipo_mensaje>" +

                "<time_sent>" + getTime() + "</time_sent>" +



            "</head>";
}





















// Genera cuerpo para el mensaje de entrar a tiendas


// Genera cuerpo para el mensaje para pedir tiendas TODO
function escribir_tiendas(infoMensaje){
    var mensajes = "<lista_tiendas>";
        for(let i=0; i<infoMensaje.tiendas.length; i++){
            mensajes += "<tienda>" +
                        "<id_tienda>" +
                            infoMensaje.tiendas[i].id +
                        "</id_tienda>"+
                        "<ip_tienda>" +
                            infoMensaje.tiendas[i].id +
                        "</ip_tienda>"+
                        "<puerto>"+
                            infoMensaje.tiendas[i].puerto +
                        "</puerto>"+
                    "</tienda>";
        }
    return mensajes +="</lista_tiendas>";
}

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

// https://es.stackoverflow.com/questions/360331/url-en-ajax-jquery-3-5-1

// EJEMPLO DE COMO TIENE QUE RECIBIR LA INFORMACION LOS METODOS
// DE ESPECIAL INTERES ENVIARXML

// var infoM = {
//     tipo_mensaje: 'entrada_tienda',
//     id_emisor: 3,
//     ip_emisor: '192.168.1.4',
//     tipo_receptor: 'tienda',
//     id_receptor: 10,
//     ip_receptor: '198.161.1.1',
//     puerto_receptor: '8000',
//     productos: [
//         {id: 5, cantidad: 45},
//         {id: 13, cantidad: 100}
//     ],
//     tiendas: [
//         {id:4, ip: "192.168.1.3", puerto: "8000"},
//         {id:4, ip: "192.168.1.3", puerto: "8000"}
//     ]
// }
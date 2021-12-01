class MessageManager {
    constructor(ip_monitor, puerto_monitor, ip_emisor, log) {

        this.ip_monitor = ip_monitor;
        this.puerto_monitor = puerto_monitor;
        this.ip_emisor = ip_emisor;
        this.id_emisor = -1;
        this.interfaceCrearCliente = 'crearCliente=1';

        this.tipo_emisor = 'comprador';
        this.puerto_emisor = -1;

        this.urlMonitor = 'http://' + this.ip_monitor + ':' + this.puerto_monitor;
        this.urlMonitorDuplicados = this.urlMonitor;
        this.urlMonitorCrearCliente = this.urlMonitor + "?" + this.interfaceCrearCliente;

        this.log = log;
    }

    //Funcion JQuery ajax para mandar mensajes y recibir respuesta
    enviarXML(infoMensaje) {
        var respuesta = -1, thisClass = this;
        var mensaje = this._crearMensaje(infoMensaje);

        console.log(mensaje)

        $.ajax({
            url: 'http://' + infoMensaje.ip_receptor + ":" + infoMensaje.puerto_receptor,
            data: mensaje,
            type: 'POST',
            async: false,
            // datatype: "string",
            // contentType:"string",

            beforeSend: function () {
                if (infoMensaje.tipo_receptor != 'monitor') {
                    $.post(
                        thisClass.urlMonitorDuplicados,
                        mensaje
                    )
                }
            },

            // Recepcion del mensaje
            success: function (response) {
                console.log("Mensaje recibido de: " + infoMensaje.ip_receptor);
                // console.log(response);
                respuesta = thisClass.leerXML(response);
                console.log("Mensaje recibido de " + infoMensaje.ip_receptor + " procesado");
            },

            // En caso de error
            error: function (response) {
                console.log("Error enviando a " + infoMensaje.ip_receptor + ": " + JSON.stringify(response));
            }
        });

        return respuesta;
    }

    // Procesas los mensajes llegados como respuesta
    leerXML(xml) {
        // console.log(xml);
        var contenido, parser;

        // Creación del árbol DOM y validación
        parser = new DOMParser();
        xml = parser.parseFromString(xml, "text/xml");

        contenido = {
            emisor_ip: xml.getElementsByTagName('IP')[0].childNodes[0].nodeValue,
            emisor_id: xml.getElementsByTagName('ID')[0].childNodes[0].nodeValue,
            emisor_tipo: xml.getElementsByTagName('tipo')[0].childNodes[0].nodeValue,
            receptor_ip: xml.getElementsByTagName('IP')[1].childNodes[0].nodeValue,
            receptor_id: xml.getElementsByTagName('ID')[1].childNodes[0].nodeValue,
            receptor_tipo: xml.getElementsByTagName('tipo')[1].childNodes[0].nodeValue,
            id_ip: xml.getElementsByTagName('ipemisor')[0].childNodes[0].nodeValue,
            id_cont: xml.getElementsByTagName('contador')[0].childNodes[0].nodeValue,
            protocolo: xml.getElementsByTagName('protocolo')[0].childNodes[0].nodeValue,
            tipo_mensaje: xml.getElementsByTagName('tipomen')[0].childNodes[0].nodeValue,
            lista_productos: [],
            lista_tiendas: []
        };

        // Productos
        try {
            contenido['lista_productos'] = this._getProductos(xml);
        } catch (error) { }


        // Tiendas
        try {
            contenido['lista_tiendas'] = this._getTiendas(xml);
        } catch (error) { }


        return contenido;
    }

    get_Monitor() {
        // https://www.w3schools.com/jquery/ajax_get.asp

        var respuesta = -1, thisClass = this;

        $.ajax({
            url: this.urlMonitorCrearCliente,
            type: "GET",
            async: false,
            datatype: "text",
            contentType: "text",

            beforeSend: function () {
                console.log("Intentando obtener datos de: " + thisClass.urlMonitorCrearCliente);
            },

            success: function (data) {
                console.log("Conexion realizada con el Monitor");
                // console.log(data);
                respuesta = thisClass.leerXML(data);
                console.log(respuesta)
                thisClass.id_emisor = respuesta.head.id_receptor;
            },

            error: function (response) {
                console.log("No se pudo conectar con el Monitor");
            }
        });

        // var parser, xml, respuesta;

        // parser = new DOMParser();
        // xml = parser.parseFromString("<?xml version=\"1.0\" encoding=\"utf-8\"?><root xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><head><tipo_mensaje>reg_cliente</tipo_mensaje><tipo_emisor>monitor</tipo_emisor><id_emisor>-1</id_emisor><ip_emisor>192.168.1.4</ip_emisor><puerto_emisor>1234</puerto_emisor><tipo_receptor>comprador</tipo_receptor><id_receptor>3</id_receptor><ip_receptor>192.168.1.4</ip_receptor><puerto_receptor>-1</puerto_receptor><time_sent>00:00:00</time_sent></head><body xsi:type=\"reg_cliente\"><lista_productos><producto><id_producto>1</id_producto><cantidad>3</cantidad></producto><producto><id_producto>3</id_producto><cantidad>5</cantidad></producto><producto><id_producto>7</id_producto><cantidad>100</cantidad></producto></lista_productos><lista_tiendas><tienda><id_tienda>10</id_tienda><ip_tienda>192.168.1.5</ip_tienda><puerto>8000</puerto></tienda><tienda><id_tienda>11</id_tienda><ip_tienda>192.168.1.10</ip_tienda><puerto>8000</puerto></tienda></lista_tiendas></body></root>", "text/xml");

        // respuesta = this.leerXML(xml);

        this.id_emisor = thisClass.id_emisor

        console.log(this.id_emisor)

        return respuesta;
    }

    finaliza_cliente(infoMensaje) {

        $.post(
            this.urlMonitor,
            this._crearMensaje(infoMensaje)
        )

    }

    // Genera el mensaje XML completo
    _crearMensaje(infoMensaje) {

        var mensaje = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
            '<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
            this._escribirCabecera(infoMensaje) +
            this._escribirCuerpo(infoMensaje) +
            "</root>";

        return mensaje;
    }

    // Genera la cabezara de un mensaje XML para enviar
    _escribirCabecera(infoMensaje) {
        return "<infoMensaje>" +

            "<emisor>" +
            "<IP>" +
            this.ip_emisor +
            "</IP>" +
            "<ID>" +
            this.id_emisor +
            "</ID>" +
            "<tipo>" +
            this.tipo_emisor +
            "</tipo>" +
            "</emisor>" +

            "<receptor>" +
            "<IP>" +
            infoMensaje.ip_receptor +
            "</IP>" +
            "<ID>" +
            infoMensaje.id_receptor +
            "</ID>" +
            "<tipo>" +
            infoMensaje.id_receptor +
            "</tipo>" +
            "</receptor>" +

            "<id>" +
            "<ipemisor>" +
            infoMensaje.ip_emisor +
            "</ipemisor>" +
            "<contador>" +
            infoMensaje.id_cont +
            "</contador>" +
            "</id>" +

            "<protocolo>" +
            infoMensaje.protocolo +
            "</protocolo>" +

            "<tipoMen>" +
            infoMensaje.tipo_mensaje +
            "</tipoMen>" +

            "</infoMensaje>";
    }

    // Genera el cuerpo del mensaje XML en funcion del tipo
    _escribirCuerpo(infoMensaje) {
        var mensaje = "<body xsi:type=\"" + infoMensaje.tipo_mensaje + "\">";

        switch (infoMensaje.tipo_mensaje) {

            /* ALTA */

            case 'msi': // Mensaje de Solicitud de Inicio
                break;

            /* INICIO ACTIVIDAD */

            case 'mei': // Mensaje de Espera de Inicio
                break;

            /* SOLICITUD ENTRADA EN TIENDA */

            case 'mset': // Mensaje Solicitud de Entrada en Tienda
                mensaje += this._escribir_hora(infoMensaje);
                break;

            /* COMPRA */

            case 'msip': // Mensaje Solicitud de Información de Productos
                mensaje += this._escribir_productos(infoMensaje);
                break;

            case 'mcp': // Mensaje de Compra de Productos
                mensaje += this._escribir_productos(infoMensaje);
                break;

            /* CONSULTA DE OTRAS TIENDAS */

            case 'msit': // Mensaje de Solicitud de Información de Tiendas
                break;

            /* SOLICITUD DE SALIDA DE TIENDA */

            case 'msst': // Mensaje de Solicitud de Salida de Tienda
                break;

            /* FIN DE OBJETIVOS */

            case 'mfo': // Mensaje Fin de Objetivos
                break;
        }

        return mensaje + "</body>";
    }

    // Genera cuerpo para el mensaje de entrar a tiendas
    _escribir_productos(infoMensaje) {
        var mensajes = "<listaProductos>";
        for (let i = 0; i < infoMensaje.productos.length; i++) {
            mensajes += "<producto>" +
                "<id>" +
                infoMensaje.productos[i].id +
                "</id>" +
                "<cantidad>" +
                infoMensaje.productos[i].cantidad +
                "</cantidad>" +
                "<precio>" +
                infoMensaje.productos[i].precio +
                "</precio>" +
                "</producto>";
        }
        return mensajes += "</lista_productos>";

    }

    _escribir_hora(infoMensaje) {
        return "<hora>" +
        infoMensaje.hora +
        "</hora>" +
        "<minuto>" +
        infoMensaje.minuto +
        "</minuto>"
    }

    // Genera cuerpo para el mensaje para pedir tiendas TODO
/*     _escribir_tiendas(infoMensaje) {
        var mensajes = "<lista_tiendas>";
        for (let i = 0; i < infoMensaje.tiendas.length; i++) {
            mensajes += "<tienda>" +
                "<id_tienda>" +
                infoMensaje.tiendas[i].id_tienda +
                "</id_tienda>" +
                "<ip_tienda>" +
                infoMensaje.tiendas[i].ip_tienda +
                "</ip_tienda>" +
                "<puerto>" +
                infoMensaje.tiendas[i].puerto_tienda +
                "</puerto>" +
                "</tienda>";
        }
        return mensajes += "</lista_tiendas>";
    } */

    // Procesa los productos
    _getProductos(xml) {
        var lista = [];
        var productos = xml.getElementsByTagName('lista_productos')[0].childNodes;

        productos.forEach(
            function (valor) {
                lista.push({
                    id_producto: valor.getElementsByTagName('id_producto')[0].childNodes[0].nodeValue,
                    cantidad: valor.getElementsByTagName('cantidad')[0].childNodes[0].nodeValue
                });
            }
        );
        return lista;
    }

    // Procesa las tiendas
    _getTiendas(xml) {
        var lista = [];
        var tiendas = xml.getElementsByTagName('lista_tiendas')[0].childNodes;

        tiendas.forEach(
            function (valor) {
                lista.push({
                    id_tienda: valor.getElementsByTagName('id_tienda')[0].childNodes[0].nodeValue,
                    ip_tienda: valor.getElementsByTagName('ip_tienda')[0].childNodes[0].nodeValue,
                    puerto_tienda: valor.getElementsByTagName('puerto')[0].childNodes[0].nodeValue
                });
            }
        );

        return lista;
    }

}
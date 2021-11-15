class Comprador {

    //Constructor en el que me he basado
    constructor(ip, puerto, ipMonitor, puertoMonitor, log) {
		this.ip = ip;
		this.puerto = puerto;
		this.ipMonitor = ipMonitor;
		this.puertoMonitor = puertoMonitor;
		this.id = 0;
		this.listaCompra = [];
		this.listaTiendas = [];
		this.tiempoConsumido = 0;
		this.log = log;

		this.GestorMensajes = new MessageManager(ipMonitor, puertoMonitor, ip, log);
	}

    //Método para ver si quedan productos por comprar
    productsLeft(){

        if (this.listaCompra.length == 0){
            return false;
        }
        
        for (var producto of this.listaCompra) {
            if (parseFloat(producto.cantidad) != 0){
                return true;
            }
        }
            
        return false;
    }
    
    //Método para añadir al Log los eventos que van ocurriendo
    addToLog(string) {
        this.log.push(string + "\n");
        requestUpdate(this.id);
    }

    //Método para mandar MSI y recibir ACK o ERROR
    async altaACK() {
        var mensaje = {
            tipo_emisor:'comprador',
            id_emisor: this.id,
            ip_emisor: this.ip,
            puerto_emisor: this.puerto,
            tipo_receptor: 'monitor',
            ip_monitor: this.ipMonitor,
            puerto_monitor: this.puertoMonitor,//30
            protocolo:'alta',
            tipo: 'MSI',
        }

        var respuesta = await this.GestorMensajes.enviarXML(mensaje);

        return respuesta;
    }

    //Método para recibir MCI
    async altaMCI(){
        var respuesta_mci = await this.GestorMensajes.leerXML();

        return respuesta_mci;
    }

    /*
    //Método para mandar SET y recibir ACK o ERROR(sería senalaEntrada)
    async entrarTienda() {
        var mensaje = {
            tipo_emisor:'comprador',
            id_emisor: this.id,
            ip_emisor: this.ip,
            puerto_emisor: this.puerto,
            tipo_receptor: 'tienda',
            id_receptor: this.listaTiendas[tiendaActual].id_tienda,
            ip_receptor: this.listaTiendas[tiendaActual].ip_tienda,
            puerto_receptor: this.listaTiendas[tiendaActual].puerto_tienda,//30
            protocolo:'entrada_tienda',
            tipo: 'MSET',
            productos: this.listaCompra,
            tiendas: this.listaTiendas
        }

        var respuesta_entrada = await this.GestorMensajes.enviarXML(mensaje);

        return respuesta_entrada;
    }
    */
   
    //Método para mandar MSIP y recibir ACK o ERROR
    async compraACK() {
        var mensaje = {
            tipo_emisor:'comprador',
            id_emisor: this.id,
            ip_emisor: this.ip,
            puerto_emisor: this.puerto,
            tipo_receptor: 'tienda',
            id_receptor: this.listaTiendas[tiendaActual].id_tienda,
            ip_receptor: this.listaTiendas[tiendaActual].ip_tienda,
            puerto_receptor: this.listaTiendas[tiendaActual].puerto_tienda,//30
            protocolo:'compra',
            tipo: 'MSIP',
            productos: this.listaCompra,
            tiendas: this.listaTiendas
        }

        var respuesta_msip = await this.GestorMensajes.enviarXML(mensaje);

        return respuesta_msip;
    }

    //Método para recibir MIP
    async compraMIP(){
        var respuesta_mip = await this.GestorMensajes.leerXML();

        return respuesta_mip;
    }

    //Método para mandar MSIT y recibir MIT
    async askForShops(tiendaActual) {
        var mensaje = {
            tipo_emisor:'comprador',
            id_emisor: this.id,
            ip_emisor: this.ip,
            puerto_emisor: this.puerto,
            tipo_receptor: 'tienda',
            id_receptor: this.listaTiendas[tiendaActual].id_tienda,
            ip_receptor: this.listaTiendas[tiendaActual].ip_tienda,
            puerto_receptor: this.listaTiendas[tiendaActual].puerto_tienda,//30
            protocolo:'solicitar_tiendas',
            tipo: 'MSIT',
            productos: this.listaCompra,
            tiendas: this.listaTiendas
        }

        var respuesta = await this.GestorMensajes.enviarXML(mensaje);

        return respuesta;
    }
    
    //Método que controla la funcionalidad de los compradores
    async run() {

        //Creamos una variable para realizar el inicio de la actividad y mandar los mensajes correspondientes
        var inicioActividad;

        //Llamamos al método pideIni para mandar MEI y recibir MAE
        await this.pideIni().then(function (resultado1) {
            inicioActividad = resultado1
        });

        //Si el mensaje recibido no es el MAE
        if (inicioActividad == -1) {
            //Añadimos un mensaje al log
            this.addToLog("El comprador " + this.id + " ha obtenido los datos del monitor " + this.ipMonitor + " con fracaso.");
            // Finaliza si error devolviendo nulo
            return null;
        }
        
        //Si el mensaje es el MAE Añadimos un mensaje al log
        this.addToLog("El comprador " + this.id + " ha obtenido los datos del monitor " + this.ipMonitor + " con exito.");
        
        //Creamos una variable para saber la tienda en la que nos encontramos según la lista de tiendas
        var tiendaActual = 0;

        // Mientras queden productos por comprar
        while (this.productsLeft() && tiendaActual < this.listaTiendas.length) {

            //Creamos una variable para la entrada a la tienda que nos toca
            var entradaTienda1;

            //Llamamos a los métodos para mandar los mensajes de entrada a tienda
            await this.entrarTienda().then(function (resultado2) {
                entradaTienda1 = resultado2
            });

            //Si recibe un mensaje de error al entrar en la tienda
            if ((entradaTienda == -1) || (entradaTienda.infoMensaje.tipo=='Error')) {
                //Añadimos un mensaje al log
                this.addToLog("El comprador " + this.id + " ha fallado al entrar a la tienda " + this.listaTiendas[tiendaActual].id_tienda);
                return null; // Finaliza si error devolviendo nulo
            }
            
            //Si recibimos el ack de confirmación de que hemos entrado a la tienda correctamente, añadimos un mensaje al log
            this.addToLog("El comprador " + this.id + " ha entrado a la tienda " + this.listaTiendas[tiendaActual].id_tienda + " con exito.");
    
            var error = false; // Para indicar cuando hay algun error
            
            //Creamos una variable para gestionar la solicitud de los productos que tenemos que comprar
            var solicitudProductos;
            //Llamamos al método necesario para mandar el MSIp y recibir el ACK de confirmación
            await this.compraACK(tiendaActual).then(function (resultado3) {
                solicitudProductos = resultado3
            });

            //Creamos una variable para rebir los productos que tiene la tienda
            var productosTienda;
            //Llamamos al método necesario para recibir el MIP
            await this.compraMIP(tiendaActual).then(function (resultado4) {
                productosTienda = resultado4
            });
            
            //Si hemos recibido el ACK y el MIP
            if (((solicitudProductos=!-1) && (solicitudProductos.infoMensaje.tipo=='ACK')) && (productosTienda=!-1)) {
                
                //Añadimos un mensaje al log
                this.addToLog("El cliente " + this.id + " se dispone a comprar productos a la tienda " + this.listaTiendas[tiendaActual].id_tienda);
                //Cogemos los productos que tiene la tienda para realizar la compra
                productos=productosTienda.lista_productos;
                //Llamamos al método que gestiona la compra de productos(lógica+mensajes)
                this.reduceProductsQuantity(productos);
    
            } else {
                // Error en el envio de la lista de la compra
                this.addToLog("El cliente " + this.id + " ha obtenido un error al comprar productos");
                error = true;
            }
    
            //Si aun quedan productos por comprar, preguntamos por otras tiendas
            if (this.productsLeft() && !error) {

                //Añadimos un mensaje al log
                this.addToLog("El cliente " + this.id + " tiene productos restantes por comprar.");
                
                // Espera a que un cliente le pase la lista de las tiendas
                var preguntarTiendas;

                //Llamamos al método para recibir las tiendas
                await this.askForShops(tiendaActual).then(function (resultado5) {
                    preguntarTiendas = resultado5
                });
                
                //Si el mensaje recibido es el MIT
                if (preguntarTiendas != -1) {
                    // var tiendas = resultado['body']['lista_tiendas'];
                    var tiendas = preguntarTiendas['body']['lista_tiendas'];//Cogemos las tiendas que nos han pasado
                    
                    //Añadimos las tiendas que nos han pasado a la lista de tiendas
                    this.listaTiendas = this.agregarTiendas(tiendas);
                } else {
                    //Si recibimos un mensaje de erorr, añadimos un mensaje al log
                    this.addToLog("El cliente " + this.id + " ha obtenido un error al recibir tiendas");
                    error = true;
                }
            }
            
            //Creamos una variable para la salida de la tienda
            var salirTienda;

            //Llamamos al método necesario para mandar el MSST y recibir el ACK o ERROR
            await this.salidaTienda(tiendaActual).then(function (resultado6) {
                salirTienda = resultado6
            });

            //Si recibimos el ACK, añadimos un mensaje al log
            if (salirTienda != -1) {
                this.addToLog("El cliente " + this.id + " ha salido de la tienda " + this.listaTiendas[tiendaActual].id_tienda)
            } else {
                // Error al salir de la tienda actual
                this.addToLog("El cliente " + this.id + " ha obtenido un error al salir de la tienda");
                error = true;
            }

            // Avanzamos a la siguiente tienda
            tiendaActual = tiendaActual + 1;
        }
            
        //Fin de la compra
        if (this.productsLeft()) {
            //Compra fallida (no hemos comprado todos los productos)
            this.addToLog("El cliente " + this.id + " no ha sido capaz de terminar sus compras con exito.");
        } else {
            this.addToLog("El cliente " + this.id + " ha terminado sus compras con exito.");
        }
    
        //Desconectamos al cliente
        this.finalizarCliente();
    }
}
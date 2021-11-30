class Comprador {
  constructor(ip, puerto, ipMonitor, puertoMonitor, log) {
    
		//necesarios para las comunicaciones
    
		this.ip = ip;
		this.puerto = puerto;
		this.ipMonitor = ipMonitor;
		this.puertoMonitor = puertoMonitor;
		this.id = 0;
     //
		this.listaCompra = [];
		this.listaTiendas = [];

		this.GestorMensajes = new MessageManager(ipMonitor, puertoMonitor, ip);//, log);
  }

    async senalaEntrada(tiendaActual) {
        //para generar el XML del mensaje InfoMensaje
		var infoM = {
			tipo_mensaje: 'entrada_tienda',
			tipo_receptor: 'tienda',
			id_receptor: this.listaTiendas[tiendaActual].id_tienda,
			ip_receptor: this.listaTiendas[tiendaActual].ip_tienda,
			puerto_receptor: this.listaTiendas[tiendaActual].puerto_tienda,
			productos: this.listaCompra,
			tiendas: this.listaTiendas
		}
        //esperas la respuesta de la tienda
		var respuesta = await this.GestorMensajes.enviarXML(infoM);
		return respuesta;
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

    reduceProductsQuantity(id, quantity) {
        for (var i = 0; i < this.listaCompra.length; i++) {
          //Si encuentra el producto con la misma id en la lista de la compra del cliente le quita la cantidad especifica
          if (this.listaCompra[i].id_producto == id && parseFloat(this.listaCompra[i].cantidad) > 0) {
            if (parseFloat(this.listaCompra[i].cantidad) < parseFloat(quantity)){
               var comprados = this.listaCompra[i].cantidad
              this.listaCompra[i].cantidad = "0";
              return comprados
            }else{
              this.listaCompra[i].cantidad = this.listaCompra[i].cantidad - quantity;
              return quantity
            }
          }
        }
        return 0
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
   
    //Método para mandar MSIP y recibir ACK o ERROR
    async compraACK(tiendaActual) {
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

    async compraMCP(tiendaActual,lista_comprados) {
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
            tipo: 'MCP',
            productos: lista_comprados,
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
    
     
    //Agrega de la lista de tiendas pasada, las tiendas que no conozca el cliente
	agregarTiendas(tiendas) {
		// Suponemos que la lista tiendas que nos pasan no tiene duplicados de tiendas
		var tiendaActual = {};

		//Tiendas por añadir
		var tiendasNuevas = [];

		//Saca las tiendas
		for (var i = 0; i < tiendas.length; i++) {
			tiendaActual = tiendas[i];

			var isNueva = true;
			//Comprueba si la tienda está en las listas conocidas
			for (var j = 0; j < this.listaTiendas.length; j++) {

				if (tiendaActual.id_tienda == this.listaTiendas[j].id_tienda) {
					isNueva = false;
					break;
				}
			}

			//Si la tienda es nueva, se introduce a la lista de tienda y a la lista de tiendas nuevas
			if (isNueva) {
				this.listaTiendas.push(tiendaActual);
				tiendasNuevas.push(tiendaActual);
			}
		}

		//Mensaje de log correspondiente
		// console.log(tiendasNuevas)
		return this.listaTiendas
	}


    //Pide productos y tiendas
    async pideIni() {
		var mensaje = {
			tipo_emisor:'comprador',
			id_emisor: this.id,
			ip_emisor: this.ip,
			puerto_emisor: this.puerto,
			tipo_receptor: 'monitor',
			ip_monitor: this.ipMonitor,
			puerto_monitor: this.puertoMonitor,//30
			protocolo:'inicio',
			tipo: 'MEI',
		}

		var respuesta = await this.GestorMensajes.enviarXML(mensaje);


        if (respuesta != -1) {
			this.listaCompra = respuesta['body']['lista_productos'];
			this.listaTiendas = respuesta['body']['lista_tiendas'];
			this.id = respuesta['head']['id_receptor'];
			this.tiempoConsumido = this.tiempoConsumido + respuesta['head']['time_sent']
        }

		return respuesta;
	}


    async salidaTienda(tiendaActual) {
		var infoM = {
			tipo_mensaje: 'salida_tienda',
            tipo_emisor:'comprador',
			id_emisor: this.id,
			ip_emisor: this.ip,
			puerto_emisor: this.puerto,
			tipo_receptor: 'tienda',
			id_receptor: this.listaTiendas[tiendaActual].id_tienda,
			ip_receptor: this.listaTiendas[tiendaActual].ip_tienda,
			puerto_receptor: this.listaTiendas[tiendaActual].puerto_tienda,
		}
		var respuesta = await this.GestorMensajes.enviarXML(infoM)
		return respuesta;
	}  
  
    //Método que controla la funcionalidad de los compradores
    async run() {

        //Creamos una variable para realizar el inicio de la actividad y mandar los mensajes correspondientes
        var inicioActividad;

        //Creamo una variable para controlar que se realiza el inicio de actividad
        var inicio_correcto=false;

        //Hacemos un bucle que se ejecute hasta que el inicio de actividad se ejecute correctamente
        while(inicio_correcto==false){
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
            else{

                //Si el mensaje es el MAE Añadimos un mensaje al log
                this.addToLog("El comprador " + this.id + " ha obtenido los datos del monitor " + this.ipMonitor + " con exito.");
                //Cambiamos el valor de la variable de control para que ya no se ejecute el bucle
                inicio_correcto=true;
            }
        }

        //Creamos una variable para saber la tienda en la que nos encontramos según la lista de tiendas
        var tiendaActual = 0;

        // Mientras queden productos por comprar y haya tiendas que visitar
        while (this.productsLeft() && tiendaActual < this.listaTiendas.length) {

            //Creamos una variable para la entrada a la tienda que nos toca
            var entradaTienda1;

            //Llamamos a los métodos para mandar los mensajes de entrada a tienda
            await this.senalaEntrada().then(function (resultado2) {
                entradaTienda1 = resultado2
            });

            //Si recibe un mensaje de error al entrar en la tienda
            if ((entradaTienda1 == -1) || (entradaTienda1.infoMensaje.tipo=='Error')) {
                //Añadimos un mensaje al log
                this.addToLog("El comprador " + this.id + " ha fallado al entrar a la tienda " + this.listaTiendas[tiendaActual].id_tienda);
                return null; // Finaliza si error devolviendo nulo
            }
            
            //Si recibimos el ack de confirmación de que hemos entrado a la tienda correctamente, añadimos un mensaje al log
            this.addToLog("El comprador " + this.id + " ha entrado a la tienda " + this.listaTiendas[tiendaActual].id_tienda + " con exito.");
    
            var error = false; // Para indicar cuando hay algun error
            
            //Creamos una variable para gestionar la solicitud de los productos que tenemos que comprar
            var solicitudProductos;
            //Llamamos al método necesario para mandar el MSIP y recibir el ACK de confirmación
            await this.compraACK(tiendaActual).then(function (resultado3) {
                solicitudProductos = resultado3
            });

            //Creamos una variable para rebir los productos que tiene la tienda
            var productosTienda;
            //Llamamos al método necesario para recibir el MIP
            await this.compraMIP().then(function (resultado4) {
                productosTienda = resultado4
            });
            
            //Si hemos recibido el ACK y el MIP
            if (((solicitudProductos=!-1) && (solicitudProductos.infoMensaje.tipo=='ACK')) && (productosTienda=!-1)) {
                
                //Añadimos un mensaje al log
                this.addToLog("El cliente " + this.id + " se dispone a comprar productos a la tienda " + this.listaTiendas[tiendaActual].id_tienda);
                //Cogemos los productos que tiene la tienda para realizar la compra
                productos=productosTienda.lista_productos;
                //Comprueba si tiene algun producto que necesite el cliente
				var i = 0;

                var lista_comprados=[];

				while (i < productos.length) {
					// Procesa los productos comprados
					cantidad_comprado=this.reduceProductsQuantity(productos[i].id_producto, productos[i].cantidad);

                    if(cantidad_comprado > 0){
                        lista_comprados.push({
                            id_producto: productos[i].id_producto,
                            cantidad: cantidad_comprado
                        });
                    }
					i++;
				}

                var confirmarCompra;

                await this.compraMCP(tiendaActual,lista_comprados).then(function (resultado_compra) {
                    confirmarCompra = resultado_compra
                });

                if (confirmarCompra == -1) {
                    this.addToLog("El cliente " + this.id + " no ha podido realizar la compra");
                    error=true;
                }else{
                    this.addToLog("El cliente " + this.id + " ha realizado la compra correctamente");  
                }
    
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


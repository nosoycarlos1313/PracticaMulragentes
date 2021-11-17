	
    
    
class Comprador {
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
	









}
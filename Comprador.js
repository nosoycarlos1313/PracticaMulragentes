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
}
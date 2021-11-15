var compradores = [];

var compradorMostrado = 0;

//Función principal para controlar eventos
$(document).ready(
function () {
    $('#panel').hide();
    $('#enviar').click(
        //Inicializamos los clientes, escondemos el panel de inicio y se construye dinámicamente el panel de los compradores lanzados
        function (e) {
            e.preventDefault();
            var form = document.getElementById("formulario");
            form.classList.add("was-validated");
            if (form.checkValidity()) {
                $("#monitor").hide();
                crearCompradores();
            }
        }
    );
    $('#refresca').click(
        function(e){
            e.preventDefault();
            compradores[0].listaCompra.push({id_producto: 9, cantidad: "99"});
            compradores[0].listaTiendas.push({id_tienda: 10, ip_tienda: "123.456.789"});
            compradores[0].dineroGastado += 2;
            compradores[0].tiempoConsumido += 1;
            compradores[0].log.push("Añadido un nuevo elemento \n");
            requestUpdate(compradores[0].id);
        }
    );
}

)

// Crea los compradores al pulsar el botón de enviar 
function crearCompradores() {
    //Recogemos los valores de los campos
    const ipComprador = $('#ipComprador').val();
    const ipMonitor = $('#ipMonitor').val();
    const numCompradores = $('#numCompradores').val();

    //Creamos la lista de compradores
    for (let i = 0; i < numCompradores; i++) {
        //Llamamos al constructor
        var comprador = new Comprador(ipComprador, 80, ipMonitor, 80, []);

        //Creamos para recibir el ack de alta
        var respuesta_alta_ack=-1;

        //Creamos una variable para recibir el MCI
        var respuesta_alta_mci=-1;

        //Llamamos al método necesario para mandar el MSI y recibir el ACK o ERROR
		await comprador.altaACK().then(function (resultado1) {
			respuesta_alta_ack = resultado1
		});

        //Llamamos al método para recibir el MCI
        await comprador.altaMCI().then(function (resultado2) {
			respuesta_alta_mci = resultado2
		});

        //Si recibimos tanto ACK como MCI
        if(((respuesta_alta_ack=!-1) && (respuesta_alta_ack.infoMensaje.tipo=='ACK')) && (respuesta_alta_mci=!-1)){
            //Añadimos el comprador a la lista de compradores
            compradores.push(comprador);
            //Añadimos un mensaje al log
            console.log("El comprador" + i + "se ha dado de alta correctamente");
        } else{
            //Si no se hace el alta correctamente, añadimos mensaje al log y devolvemos nulo
            console.log("El comprador" + i + "ha fallado al darse de alta");
            return null;
        }
        
    }

    crearTabCompradores();

    $("#panel").show("fast", function(){
        console.log("show");
        $("#log").css('height', 200 + 'px');
        compradores.forEach((cliente)=> cliente.run())
    });

}


async function crearTabCompradores() {
    console.log("creando tablas")
    compradores.forEach(
        function (c, i) {
            console.log("comprador", c)
            //Primero recogemos el contenido
            var contenido = $('#TabContenido');

            //Como queremos mostrar la información del primer comprador por defecto, distinguimos la primera iteración de las demas. La estructura es la misma, tan solo cambian algunos atributos
            //En los dos casos añadimos primeramente un tab para el cliente y después creamos el panel al que añadir la información a desplegar de este
            if( i == 0){
                $('#TabCompradores').append('<li class="nav-item"><a class="nav-link active" id="comprador' + c.id + '-tab" onclick="selectComprador('+i+')" data-toggle="tab" role="tab"  aria-selected="true">C '+ (i+1) + '</a></li>');
            } else {
                $('#TabCompradores').append('<li class="nav-item"><a class="nav-link" id="comprador' + c.id + '-tab" onclick="selectComprador('+i+')"  data-toggle="tab" role="tab"  aria-selected="true">C '+ (i+1) + '</a></li>');
            }
        }
    );
    selectComprador(0)
}

// Funcion que genera una tabla con los elementos de una lista
function creaTabla(lista){
    if (lista.length == 0){
        return "No hay elementos"
    }
    else{
        var tabla = '<table class="table table-striped" style="table-layout: fixed;"><thead class="thead-dark"><tr>'
        elementos = Object.keys(lista[0])
        for (var i = 0; i < elementos.length; i++){
            tabla += '<th scope="col">'+ elementos[i]+'</th>'
        }
        tabla += '</tr></thead><tbody>'
        for (var i = 0; i < lista.length; i++){
            tabla += '<tr>'
            elementos.forEach(function (item) {
                tabla += '<td>' + lista[i][item] +'</td>'
            });
            tabla += '</tr>'
        }
        tabla += '</tbody></table>'
    return tabla
    }
}

// Función que cambia el contenido al comprador seleccionado
function selectComprador(index){
    compradorMostrado = index;
    requestUpdate(compradores[index].id)
}

// Tiene que ser llamada por los compradores cada vez que realicen una accion
function requestUpdate(id) {
    if (posId(id) == compradorMostrado){
        $("#idComprador").html("#"+compradores[compradorMostrado].id)
        $("#listaCompra").html(creaTabla(compradores[compradorMostrado].listaCompra));
        $("#listaTiendas").html(creaTabla(compradores[compradorMostrado].listaTiendas));
        $("#dineroGastado").html(compradores[compradorMostrado].dineroGastado);
        $("#tiempoConsumido").html(compradores[compradorMostrado].tiempoConsumido);
        $("#log").html(compradores[compradorMostrado].log.slice().reverse());
        console.log(compradores[compradorMostrado].log[0])
        $("#log").css('height', 15 + 'px');
        var scroll_height = $("#log").get(0).scrollHeight;
        $("#log").css('height', scroll_height + 'px');
    }
}

// Función que devuelve en indice dentro del vector de un comprador dada su id
function posId(id){
    return compradores.findIndex((c) => c.id === id)
}
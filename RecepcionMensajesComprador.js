/* Recepcion mensajes*/ 

// Esta funcion recibe un xml y se encarga de guardar en un dicionario los valores del xml
// El primerindice hace referencia al numero con nombre de esa etiqueta que tiene que buscar (el primer id que aparece, el segundo...)
function leerXML(xml){
    var contenido, parser;
    contenido = {
            emisor_ip: xml.getElementsByTagName('ip')[0].childNodes[0].nodeValue,
            emisor_id: xml.getElementsByTagName('id')[0].childNodes[0].nodeValue,
            emisor_tipo: xml.getElementsByTagName('tipo')[0].childNodes[0].nodeValue,
            receptor_ip: xml.getElementsByTagName('ip')[1].childNodes[0].nodeValue,
            receptor_id: xml.getElementsByTagName('id')[1].childNodes[0].nodeValue,
            receptor_tipo: xml.getElementsByTagName('tipo')[1].childNodes[0].nodeValue,
            id_ip: xml.getElementsByTagName('ipEmisor')[0].childNodes[0].nodeValue,
            id_cont: xml.getElementsByTagName('contador')[0].childNodes[0].nodeValue,
            protocolo: xml.getElementsByTagName('protocolo')[0].childNodes[0].nodeValue,
            tipo_mensaje: xml.getElementsByTagName('tipo')[2].childNodes[0].nodeValue,
            lista_productos: [],
            lista_tiendas: []
    };
        // Productos
    try {
        contenido['lista_productos'] = getProductos(xml);
    } catch (error) {}
    

    // Tiendas
    try {
        contenido['lista_tiendas'] = getTiendas(xml);
    } catch (error) {}

    return contenido;
}


function getProductos(xml){
    var lista = [];
    var productos = xml.getElementsByTagName('productos')[0].childNodes;

    productos.forEach(
        function(valor, indice, array){
            lista.push({
                id_producto: valor.getElementsByTagName('id')[0].childNodes[0].nodeValue,
                cantidad: valor.getElementsByTagName('cantidad')[0].childNodes[0].nodeValue,
                precio: valor.getElementsByTagName('precio')[0].childNodes[0].nodeValue
            });            
        }
    );

    return lista;
}

function getTiendas(xml){
    var lista = [];
    var tiendas = xml.getElementsByTagName('tienda')[0].childNodes;

        tiendas.forEach(
            function(valor, indice, array){
                lista.push({
                    ip_tienda: valor.getElementsByTagName('ip')[0].childNodes[0].nodeValue,
                    id_tienda: valor.getElementsByTagName('id')[0].childNodes[0].nodeValue
                });
            }
        );

    return lista;
}



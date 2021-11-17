/* Recepcion mensajes*/ 
function leerXML(xml){
    contenido = {
            emisor_ip: xml.getElementsByTagName('emisor')[0].childNodes[0].nodeValue,
            emisor_id: xml.getElementsByTagName('emisor')[0].childNodes[1].nodeValue,
            emisor_tipo: xml.getElementsByTagName('emisor')[0].childNodes[2].nodeValue,
            receptor_ip: xml.getElementsByTagName('receptor')[0].childNodes[0].nodeValue,
            receptor_id: xml.getElementsByTagName('receptor')[0].childNodes[1].nodeValue,
            receptor_tipo: xml.getElementsByTagName('receptor')[0].childNodes[2].nodeValue,
            id_ip: xml.getElementsByTagName('id')[0].childNodes[0].nodeValue,
            id_cont: xml.getElementsByTagName('id')[0].childNodes[1].nodeValue,
            protocolo: xml.getElementsByTagName('protocolo')[0].childNodes[0].nodeValue,
            tipo_mensaje: xml.getElementsByTagName('tipo')[0].childNodes[0].nodeValue,
            
    };
}
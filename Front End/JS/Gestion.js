var g_id_tipo_gestion ="";
var fechaHoraActual = obtenerFechaHora();

function agregarGestion(){

var id_usuario      = document.getElementById("sel_id_usuario").value;
var id_cliente      = document.getElementById("sel_id_cliente").value;
var id_tipo_gestion = document.getElementById("sel_id_tipo_gestion").value;
var id_resultado    = document.getElementById("sel_id_resultado").value;
var comentarios     = document.getElementById("txt_comentarios").value;
var fechaHoraFormateada = formatearFechaHora(fechaHoraActual);

//Encabezado de la solicitud
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

//Carga útil de datos
const raw = JSON.stringify({
  "id_usuario": id_usuario,
  "id_cliente": id_cliente,
  "id_tipo_gestion": id_tipo_gestion,
  "id_resultado": id_resultado,
  "comentarios": comentarios,
  "fecha_registro": fechaHoraFormateada
});

//Opciones de solicitud
const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

//Ejecutamos solicitud
fetch("http://144.126.210.74:8080/api/gestion", requestOptions)
  .then((response) => {
    var mensaje = "";
    const modal = document.getElementById("ModalRespuesta")
    if(response.status == 200){
      mensaje = "¡Se ha agregado la gestión con éxito!"
      document.getElementById('modalMensaje').textContent = mensaje;
      modal.addEventListener('hidden.bs.modal', () => {
      location.href ="Listar.html"});
    }
    if (response.status == 400) {
      mensaje = "Ha ocurrido un problema, revisa bien la informacion entregada."
      document.getElementById('modalMensaje').textContent = mensaje;
    }
  })
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

function listarGestion(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
    "query": "select ges.id_gestion as id_gestion,cli.id_cliente, ges.comentarios as comentarios,CONCAT(cli.nombres, ' ',cli.apellidos) as nombre_cliente,CONCAT(usu.nombres,' ' ,usu.apellidos) as nombre_usuario,tge.nombre_tipo_gestion as nombre_tipo_gestion,res.nombre_resultado as nombre_resultado,ges.fecha_registro as fecha_registro from gestion ges,usuario usu,cliente cli,tipo_gestion tge,resultado res where ges.id_usuario = usu.id_usuario and ges.id_cliente = cli.id_cliente and ges.id_tipo_gestion = tge.id_tipo_gestion and ges.id_resultado = res.id_resultado "});
    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/dynamic", requestOptions)
    .then(response => response.json())
    .then((json) => {
        json.forEach(completarFila);
        $('#tbl_gestion').DataTable();
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

function completarFila(element,index,arr){
  var fechaHoraFormateada = formatearFechaHora(element.fecha_registro);
  arr[index] = document.querySelector("#tbl_gestion tbody").innerHTML +=
`<tr>
<td>${element.id_gestion}</td>
<td>${element.nombre_usuario}</td>
<td>${element.nombre_cliente}</td>
<td>${element.nombre_tipo_gestion}</td>
<td>${element.nombre_resultado}</td>
<td>${element.comentarios}</td>
<td>${fechaHoraFormateada}</td>
<td>
<a href='actualizar.html?id=${element.id_gestion}' class='btn btn-warning'>Actualizar</a> 
<a href='eliminar.html?id=${element.id_gestion}' class='btn btn-danger'>Eliminar</a> 
</td>
</tr>`
}

function obtenerIdActualizar(){
  const queryString  = window.location.search;
  const parametros = new URLSearchParams(queryString);
  const p_id_gestion = parametros.get('id');
  g_id_gestion = p_id_gestion;
  obtenerDatosActualizar(p_id_gestion);
  const usuario = document.getElementById("Usuario")
  console.log(usuario)
}

function obtenerDatosActualizar(p_id_gestion){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/gestion/"+p_id_gestion, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormulario))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function completarFormulario(element,index,arr){
  var id_usuario = element.nombre_usuario;
  document.getElementById('sel_id_usuario').value = id_usuario;
  var id_cliente = element.nombre_cliente;
  document.getElementById('sel_id_cliente').value = id_cliente;
  var id_tipo_gestion = element.nombre_tipo_gestion;
  document.getElementById('sel_id_tipo_gestion').value = id_tipo_gestion;
  var id_resultado = element.nombre_resultado;
  document.getElementById('sel_id_resultado').value = id_resultado;
  var comentarios = element.comentarios;
  document.getElementById('txt_comentarios').value = comentarios; 
}

function actualizarGestion(){
  var id_usuario      = document.getElementById("sel_id_usuario").value;
  var id_cliente      = document.getElementById("sel_id_cliente").value;
  var id_tipo_gestion = document.getElementById("sel_id_tipo_gestion").value;
  var id_resultado    = document.getElementById("sel_id_resultado").value;
  var comentarios     = document.getElementById("txt_comentarios").value;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  const raw = JSON.stringify({
    "id_usuario": id_usuario,
    "id_cliente": id_cliente,
    "id_tipo_gestion": id_tipo_gestion,
    "id_resultado": id_resultado,
    "comentarios": comentarios,
  });
  
  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("http://144.126.210.74:8080/api/gestion/"+ g_id_gestion, requestOptions)
    .then((response) => {
      var mensaje = "";
          const modal = document.getElementById("ModalRespuesta")
          if(response.status == 200){
            mensaje = "¡Se ha actualizado la gestión con éxito!"
            document.getElementById('modalMensaje').textContent = mensaje;
            modal.addEventListener('hidden.bs.modal', () => {
            location.href ="Listar.html"});
          }
          if (response.status == 400) {
            mensaje = "Ha ocurrido un problema, revisa bien la informacion entregada."
            document.getElementById('modalMensaje').textContent = mensaje;
          }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
  }

function obtenerIdEliminar(){
  const queryString  = window.location.search;
  const parametros = new URLSearchParams(queryString);
  const p_id_gestion = parametros.get('id');
  g_id_gestion = p_id_gestion;
  obtenerDatosEliminar(p_id_gestion);
}

function obtenerDatosEliminar(p_id_gestion){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/gestion/"+p_id_gestion, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiqueta))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function completarEtiqueta(element,index,arr){
  var id_gestion = element.id_gestion;
  document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar está gestión? <b>" + id_gestion + "</b>";
}

function eliminarGestion(){
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/gestion/"+ g_id_gestion, requestOptions)
    .then((response) => {
      var mensaje = "";
      const modal = document.getElementById("ModalRespuesta")
      if(response.status == 200){
        mensaje = "¡Se ha eliminado la gestión con éxito!"
        document.getElementById('modalMensaje').textContent = mensaje;
        modal.addEventListener('hidden.bs.modal', () => {
        location.href ="Listar.html"});
      }
      if (response.status == 400) {
        mensaje = "Ha ocurrido un problema, no se pudo eliminar la gestión."
        document.getElementById('modalMensaje').textContent = mensaje;
      }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
  }
  
    function cargarSelectResultado(){
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/resultado?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
          json.forEach(completarOptionResultado);
        
        } )
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    }
    function completarOptionResultado(element,index,arr){
      arr[index] = document.querySelector("#sel_id_resultado").innerHTML +=
    `<option value='${element.id_resultado}'> ${element.nombre_resultado} </option>`
    }

    function cargarSelectCliente(){
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/cliente?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
          json.forEach(completarOptionCliente);
        
        } )
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    }
    function completarOptionCliente(element,index,arr){
      arr[index] = document.querySelector("#sel_id_cliente").innerHTML +=
    `<option value='${element.id_cliente}'> ${element.apellidos} ${element.nombres} </option>`
    }
    function cargarSelectUsuario(){
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/usuario?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
          json.forEach(completarOptionUsuario);
        
        } )
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    }
    function completarOptionUsuario(element,index,arr){
      arr[index] = document.querySelector("#sel_id_usuario").innerHTML +=
    `<option value='${element.id_usuario}'> ${element.apellidos} ${element.nombres} </option>`
    }

    function cargarSelectTipoGestion(){
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/tipo_gestion?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
          json.forEach(completarOptionTipoGestion);
        
        } )
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    }
    function completarOptionTipoGestion(element,index,arr){
      arr[index] = document.querySelector("#sel_id_tipo_gestion").innerHTML +=
    `<option value='${element.id_tipo_gestion}'> ${element.nombre_tipo_gestion} </option>`
    }

    function cargarListasDesplegables(){
      cargarSelectResultado();
      cargarSelectCliente();
      cargarSelectUsuario();
      cargarSelectTipoGestion();
    }
  
//Funciones para obtener y formatear fecha.
function obtenerFechaHora(){
  var fechaHoraActual = new Date();
  var fechaHoraFormateada = fechaHoraActual.toLocaleString('es-ES',{
    hour12 :false,
    year :'numeric',
    month :'2-digit',
    day:'2-digit',
    hour : '2-digit',
    minute :'2-digit',
    second : '2-digit'
  }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');
  return fechaHoraFormateada;
}
function formatearFechaHora(fecha_registro){
  var fechaHoraActual = new Date(fecha_registro);
  var fechaHoraFormateada = fechaHoraActual.toLocaleString('es-ES',{
    hour12 :false,
    year :'numeric',
    month :'2-digit',
    day:'2-digit',
    hour : '2-digit',
    minute :'2-digit',
    second : '2-digit',
    timeZone:'UTC'
  }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');
  return fechaHoraFormateada;
}
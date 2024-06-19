var g_cliente = ""; //Variable g_cliente establecida global
var fechaHoraActual = obtenerFechaHora(); //Variable que almacenará la fecha y hora actual del sistema

// Listar Clientes
function listarCliente(){
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch("http://144.126.210.74:8080/api/cliente", requestOptions)
      .then((response) => response.json())
      .then((json) => {
        json.forEach(completarFila);
        $('#tbl_cliente').DataTable();
      } )
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }

  //Rellenar campos con informacion obtenida
  function completarFila(element,index,arr){
    var fechaHoraFormateada = formatearFechaHora(element.fecha_registro);
    arr[index] = document.querySelector("#tbl_cliente tbody").innerHTML +=
  `<tr>
  <td>${element.id_cliente}</td>
  <td>${element.dv}</td>
  <td>${element.nombres}</td>
  <td>${element.apellidos}</td>
  <td>${element.email}</td>
  <td>${element.celular}</td>
  <td>${fechaHoraFormateada}</td>
  <td>
  <a href='actualizar.html?id=${element.id_cliente}' class='btn btn-warning'>Actualizar</a> 
  <a href='eliminar.html?id=${element.id_cliente}' class='btn btn-danger'>Eliminar</a> 
  </td>
  </tr>`
  }

  //Obtener datos cliente a actualizar
  function obtenerIdActualizar(){
    const queryString  = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_cliente = parametros.get('id');
    g_cliente = p_cliente;
    obtenerDatosActualizar(p_cliente);
  }
  function obtenerDatosActualizar(p_cliente){
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch("http://144.126.210.74:8080/api/cliente/"+p_cliente, requestOptions)
      .then((response) => response.json())
      .then((json) => json.forEach(completarFormulario))
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }

  //Rellenar campos con datos para actualizar
  function completarFormulario(element,index,arr){
    var nombre_cliente = element.nombres;
    document.getElementById('txt_nombre').value = nombre_cliente;
    var apellido_cliente = element.apellidos;
    document.getElementById('txt_apellido').value = apellido_cliente;
    var email_cliente = element.email;
    document.getElementById('txt_email').value = email_cliente;
    var celular_cliente = element.celular;
    document.getElementById('txt_celular').value = celular_cliente;
  }

  // Actualizar cliente
  function actualizarCliente(){
    var nombre_cliente = document.getElementById("txt_nombre").value;
    var apellido_cliente = document.getElementById("txt_apellido").value;
    var email_cliente = document.getElementById("txt_email").value;
    var celular_cliente = document.getElementById("txt_celular").value;

    if (nombre_cliente === "" || apellido_cliente === "" || email_cliente === "" || celular_cliente === ""){
      mensaje = "Rellena bien los campos, ¡Falta informacion!"
      document.getElementById('modalMensaje').textContent = mensaje;}
    else{
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      const raw = JSON.stringify({
        "nombres": nombre_cliente, 
        "apellidos": apellido_cliente,
        "email": email_cliente,
        "celular": celular_cliente,
      });
      
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/cliente/"+ g_cliente, requestOptions)
        .then((response) => {
          var mensaje = "";
          const modal = document.getElementById("ModalRespuesta")
          if(response.status == 200){
            mensaje = "¡Se ha actualizado el cliente con éxito!"
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
      }}

    //Obtener datos cliente a eliminar
    function obtenerIdEliminar(){
      const queryString  = window.location.search;
      const parametros = new URLSearchParams(queryString);
      const p_cliente = parametros.get('id');
      g_cliente = p_cliente;
      obtenerDatosEliminar(p_cliente);
    }
    function obtenerDatosEliminar(p_cliente){
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      fetch("http://144.126.210.74:8080/api/cliente/"+p_cliente, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarEtiqueta))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    }

    //Mostrar mensaje de confirmacion
    function completarEtiqueta(element,index,arr){
      var nombre_cliente = element.nombres;
      document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar al cliente? <b>" + nombre_cliente + "</b>";
    }

    //Eliminar Cliente
    function eliminarCliente(){

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
   
      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/cliente/"+g_cliente, requestOptions)
        .then((response) => {
          var mensaje = "";
          const modal = document.getElementById("ModalRespuesta")
          if(response.status == 200){
            mensaje = "¡Se ha eliminado el cliente con éxito!"
            document.getElementById('modalMensaje').textContent = mensaje;
            modal.addEventListener('hidden.bs.modal', () => {
            location.href ="Listar.html"});
          }
          if (response.status == 400) {
            mensaje = "Ha ocurrido un problema al eliminar el cliente"
            document.getElementById('modalMensaje').textContent = mensaje;
          }
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error))
      }

      //Agregar Cliente
      function agregarCliente(){
        var rut_cliente = document.getElementById("txt_rut").value;
        var dv_cliente = document.getElementById("txt_dv").value;
        var nombres_cliente = document.getElementById("txt_nombres").value;
        var apellidos_cliente = document.getElementById("txt_apellidos").value;
        var email_cliente = document.getElementById("txt_email").value;
        var celular_cliente = document.getElementById("txt_celular").value;
        var fechaHoraFormateada = formatearFechaHora(fechaHoraActual);;
        
        if (rut_cliente === "" || dv_cliente === "" || nombres_cliente === "" || apellidos_cliente === "" || email_cliente === "" || celular_cliente === ""){
          mensaje = "Rellena bien los campos, ¡Falta informacion!"
          document.getElementById('modalMensaje').textContent = mensaje;}
        else{
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          
          const raw = JSON.stringify({
            "id_cliente": rut_cliente,
            "dv": dv_cliente,
            "nombres": nombres_cliente,
            "apellidos": apellidos_cliente,
            "email": email_cliente,
            "celular": celular_cliente,
            "fecha_registro": fechaHoraFormateada,
          });
          
          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
          };
          
          fetch("http://144.126.210.74:8080/api/cliente", requestOptions)
            .then((response) => {
              var mensaje = "";
              const modal = document.getElementById("ModalRespuesta")
              if(response.status == 200) {
                mensaje = "¡Se ha agregado el cliente con éxito!"
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
        }}

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
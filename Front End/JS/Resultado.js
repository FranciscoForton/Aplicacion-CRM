var g_resultado = ""; //Variable g_resultado establecida global
var fechaHoraActual = obtenerFechaHora(); //Variable que almacenará la fecha y hora actual del sistema

// Listar Resultados
function listarResultado(){
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch("http://144.126.210.74:8080/api/resultado", requestOptions)
      .then((response) => response.json())
      .then((json) => {
        json.forEach(completarFila);
        $('#tbl_resultado').DataTable();
      } )
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }

  //Rellenar campos con informacion obtenida
  function completarFila(element,index,arr){
    var fechaHoraFormateada = formatearFechaHora(element.fecha_registro);
    arr[index] = document.querySelector("#tbl_resultado tbody").innerHTML +=
  `<tr>
  <td>${element.id_resultado}</td>
  <td>${element.nombre_resultado}</td>
  <td>${fechaHoraFormateada}</td>
  <td>
  <a href='actualizar.html?id=${element.id_resultado}' class='btn btn-warning'>Actualizar</a> 
  <a href='eliminar.html?id=${element.id_resultado}' class='btn btn-danger'>Eliminar</a> 
  </td>
  </tr>`
  }

  //Obtener datos resultado a actualizar
  function obtenerIdActualizar(){
    const queryString  = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_resultado = parametros.get('id');
    g_resultado = p_resultado;
    obtenerDatosActualizar(p_resultado);
  }
  function obtenerDatosActualizar(p_resultado){
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch("http://144.126.210.74:8080/api/resultado/"+g_resultado, requestOptions)
      .then((response) => response.json())
      .then((json) => json.forEach(completarFormulario))
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }

  //Rellenar campos con datos para actualizar
  function completarFormulario(element,index,arr){
    var nombre_resultado = element.nombre_resultado;
    document.getElementById('txt_nombre').value = nombre_resultado;
  }

  // Actualizar Resultado
  function actualizarResultado(){
    var nombre_resultado = document.getElementById("txt_nombre").value;

    if (nombre_resultado === ""){
      mensaje = "Rellena el campo con el nuevo nombre"
      document.getElementById('modalMensaje').textContent = mensaje;}
    else{
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      const raw = JSON.stringify({ 
        "nombre_resultado": nombre_resultado,
      });
      
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/resultado/"+ g_resultado, requestOptions)
        .then((response) => {
          var mensaje = "";
          const modal = document.getElementById("ModalRespuesta")
          if(response.status == 200){
            mensaje = "¡Se ha actualizado el resultado con éxito!"
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

    //Obtener datos resultado a eliminar
    function obtenerIdEliminar(){
      const queryString  = window.location.search;
      const parametros = new URLSearchParams(queryString);
      const p_resultado = parametros.get('id');
      g_resultado = p_resultado;
      obtenerDatosEliminar(p_resultado);
    }
    function obtenerDatosEliminar(p_resultado){
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      fetch("http://144.126.210.74:8080/api/resultado/"+p_resultado, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarEtiqueta))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    }

    //Mostrar mensaje de confirmacion
    function completarEtiqueta(element,index,arr){
      var nombre_resultado = element.nombre_resultado;
      document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar el resultado? <b>" + nombre_resultado + "</b>";
    }

    //Eliminar Resultado
    function eliminarResultado(){

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
   
      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/resultado/"+g_resultado, requestOptions)
        .then((response) => {
          var mensaje = "";
          const modal = document.getElementById("ModalRespuesta")
          if(response.status == 200){
            mensaje = "¡Se ha eliminado el resultado con éxito!"
            document.getElementById('modalMensaje').textContent = mensaje;
            modal.addEventListener('hidden.bs.modal', () => {
            location.href ="Listar.html"});
          }
          if (response.status == 400) {
            mensaje = "Ha ocurrido un problema al eliminar el resultado"
            document.getElementById('modalMensaje').textContent = mensaje;
          }
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error))
      }

      //Agregar Resultado
      function agregarResultado(){
        var id_resultado = document.getElementById("txt_id").value;
        var nombre_resultado = document.getElementById("txt_nombre").value;
        var fechaHoraFormateada = formatearFechaHora(fechaHoraActual);

        if (id_resultado === "" || nombre_resultado === ""){
          mensaje = "Rellena bien los campos, ¡Falta informacion!"
          document.getElementById('modalMensaje').textContent = mensaje;}
        else{
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          
          const raw = JSON.stringify({
            "id_resultado": id_resultado,
            "nombre_resultado": nombre_resultado,
            "fecha_registro": fechaHoraFormateada,
          });
          
          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
          };
          
          fetch("http://144.126.210.74:8080/api/resultado", requestOptions)
            .then((response) => {
              var mensaje = "";
              const modal = document.getElementById("ModalRespuesta")
              if(response.status == 200) {
                mensaje = "¡Se ha agregado el resultado con éxito!"
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
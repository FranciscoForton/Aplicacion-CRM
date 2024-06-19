var g_usuario = ""; //Variable g_usuario establecida global
var fechaHoraActual = obtenerFechaHora(); //Variable que almacenará la fecha y hora actual del sistema

// Listar Usuarios
function listarUsuario(){
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch("http://144.126.210.74:8080/api/usuario", requestOptions)
      .then((response) => response.json())
      .then((json) => {
        json.forEach(completarFila);
        $('#tbl_usuario').DataTable();
      } )
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }

  //Rellenar campos con informacion obtenida
  function completarFila(element,index,arr){
    var fechaHoraFormateada = formatearFechaHora(element.fecha_registro);
    arr[index] = document.querySelector("#tbl_usuario tbody").innerHTML +=
  `<tr>
  <td>${element.id_usuario}</td>
  <td>${element.dv}</td>
  <td>${element.nombres}</td>
  <td>${element.apellidos}</td>
  <td>${element.email}</td>
  <td>${element.celular}</td>
  <td>${element.username}</td>
  <td>${"***********"}</td>
  <td>${fechaHoraFormateada}</td>
  <td>
  <a href='actualizar.html?id=${element.id_usuario}' class='btn btn-warning'>Actualizar</a> 
  <a href='eliminar.html?id=${element.id_usuario}' class='btn btn-danger'>Eliminar</a> 
  </td>
  </tr>`
  }

  //Obtener datos usuario a actualizar
  function obtenerIdActualizar(){
    const queryString  = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_usuario = parametros.get('id');
    g_usuario = p_usuario;
    obtenerDatosActualizar(p_usuario);
  }
  function obtenerDatosActualizar(p_usuario){
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch("http://144.126.210.74:8080/api/usuario/"+p_usuario, requestOptions)
      .then((response) => response.json())
      .then((json) => json.forEach(completarFormulario))
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }

  //Rellenar campos con datos para actualizar
  function completarFormulario(element,index,arr){
    var nombre_usuario = element.nombres;
    document.getElementById('txt_nombre').value = nombre_usuario;
    var apellido_usuario = element.apellidos;
    document.getElementById('txt_apellido').value = apellido_usuario;
    var email_usuario = element.email;
    document.getElementById('txt_email').value = email_usuario;
    var celular_usuario = element.celular;
    document.getElementById('txt_celular').value = celular_usuario;
    var nickname_usuario = element.username;
    document.getElementById('txt_nickname').value = nickname_usuario;
    var contraseña_usuario = element.password;
    document.getElementById('txt_contraseña').value = contraseña_usuario;
  }

  // Actualizar usuario
  function actualizarUsuario(){
    var nombre_usuario = document.getElementById("txt_nombre").value;
    var apellido_usuario = document.getElementById("txt_apellido").value;
    var email_usuario = document.getElementById("txt_email").value;
    var celular_usuario = document.getElementById("txt_celular").value;
    var nickname_usuario = document.getElementById("txt_nickname").value;
    var contraseña_usuario = document.getElementById("txt_contraseña").value;

    if (nombre_usuario === "" || apellido_usuario === "" || email_usuario === "" || celular_usuario === "" || nickname_usuario === "" || contraseña_usuario === ""){
      mensaje = "Rellena bien los campos, ¡Falta informacion!"
      document.getElementById('modalMensaje').textContent = mensaje;}
    else{
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      const raw = JSON.stringify({
        "nombres": nombre_usuario, 
        "apellidos": apellido_usuario,
        "email": email_usuario,
        "celular": celular_usuario,
        "username": nickname_usuario,
        "password": contraseña_usuario
      });
      
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/usuario/"+ g_usuario, requestOptions)
        .then((response) => {
          var mensaje = "";
          const modal = document.getElementById("ModalRespuesta")
          if(response.status == 200){
            mensaje = "¡Se ha actualizado el usuario con éxito!"
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

    //Obtener datos usuario a eliminar
    function obtenerIdEliminar(){
      const queryString  = window.location.search;
      const parametros = new URLSearchParams(queryString);
      const p_usuario = parametros.get('id');
      g_usuario = p_usuario;
      obtenerDatosEliminar(p_usuario);
    }
    function obtenerDatosEliminar(p_usuario){
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      fetch("http://144.126.210.74:8080/api/usuario/"+p_usuario, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarEtiqueta))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    }

    //Mostrar mensaje de confirmacion
    function completarEtiqueta(element,index,arr){
      var nombre_usuario = element.nombres;
      document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar el usuario? <b>" + nombre_usuario + "</b>";
    }

    //Eliminar Usuario
    function eliminarUsuario(){

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
   
      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/usuario/"+g_usuario, requestOptions)
        .then((response) => {
          var mensaje = "";
          const modal = document.getElementById("ModalRespuesta")
          if(response.status == 200){
            mensaje = "¡Se ha eliminado el usuario con éxito!"
            document.getElementById('modalMensaje').textContent = mensaje;
            modal.addEventListener('hidden.bs.modal', () => {
            location.href ="Listar.html"});
          }
          if (response.status == 400) {
            mensaje = "Ha ocurrido un problema al eliminar el usuario"
            document.getElementById('modalMensaje').textContent = mensaje;
          }
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error))
      }

      //Agregar Usuario
      function agregarUsuario(){
        var rut_usuario = document.getElementById("txt_rut").value;
        var dv_usuario = document.getElementById("txt_dv").value;
        var nombres_usuario = document.getElementById("txt_nombres").value;
        var apellidos_usuario = document.getElementById("txt_apellidos").value;
        var email_usuario = document.getElementById("txt_email").value;
        var celular_usuario = document.getElementById("txt_celular").value;
        var username_usuario = document.getElementById("txt_username").value;
        var password_usuario = document.getElementById("txt_password").value;
        var fechaHoraFormateada = formatearFechaHora(fechaHoraActual);

        if (rut_usuario === "" || dv_usuario === "" || nombres_usuario === "" || apellidos_usuario === "" || email_usuario === "" || celular_usuario === "" || username_usuario === "" || password_usuario === ""){
            mensaje = "Rellena bien los campos, ¡Falta informacion!"
            document.getElementById('modalMensaje').textContent = mensaje;}
        else{
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          
          const raw = JSON.stringify({
            "id_usuario": rut_usuario,
            "dv": dv_usuario,
            "nombres": nombres_usuario,
            "apellidos": apellidos_usuario,
            "email": email_usuario,
            "celular": celular_usuario,
            "username": username_usuario,
            "password": password_usuario,
            "fecha_registro": fechaHoraFormateada,
          });
          
          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
          };
          
          fetch("http://144.126.210.74:8080/api/usuario", requestOptions)
            .then((response) => {
              var mensaje = "";
              const modal = document.getElementById("ModalRespuesta")
              if(response.status == 200) {
                mensaje = "¡Se ha agregado el usuario con éxito!"
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
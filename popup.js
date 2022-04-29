
console.log("Hola POPUP");

var TareasPendientes = localStorage.getItem("TareasPendientes"); //Obtener datos de localStorage

window.addEventListener('load', function () {

  $("#settings").hide();
  $("#alert").hide();

  TareasPendientes = JSON.parse(TareasPendientes); // Covertir a objeto
  if (TareasPendientes === null) { // Si no existe, creamos un array vacio.
    TareasPendientes = []; // es es un  array
    $("#content").append(
      '<h3>Bienvenido(a).</h3>'+
      '<p>Para cargar sus tareas pendientes, haga click en el icono de configuraciones en la parte superior derecha.</p>'
    );
  }else{
    if(TareasPendientes.length!=0){
      //$("#btnLoad").hide();
      $("#btnLoad").text("Actualizar Tareas");
      for(var i in TareasPendientes){
      var x = JSON.parse(TareasPendientes[i]);
      $("#content").append(
        '<div class="card text-dark bg-light mt-2 mb-3">'+
          '<div class="card-body">'+
            '<span><b>Título: </b>'+x.Titulo+'</span><br>'+
            '<span><b>Curso: </b>'+x.Curso+'</span><br>'+
            '<span><b>Link: </b><a id="link" href="'+x.Link+'" target="_blank">Click aquí</a></span><br>'+
            '<span><b>Fecha: </b>'+x.Fecha+'</span><br>'+
          '</div>'+
        '</div>'
        );
      }
    }else{
      $("#content").append(
        '<h2>Felicidades.</h2>'+
        '<p>No tienes ninguna tarea pendiente, recuerda actualizar tus tareas regularmente.</p>'
      );
    }
  }
});

$(function () {
  $("#btnLoad").click(function () {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if(tabs[0].url=='https://patmos.upeu.edu.pe/#/'){
        chrome.tabs.sendMessage(tabs[0].id, [], function(response) {

          //Limpiar Localstorage
          Eliminar(0, TareasPendientes.length);

          //Limpiar content
          var node= document.getElementById("content");
          node.querySelectorAll('*').forEach(n => n.remove());

          console.log(response);
  
          if(response.length!=0){
            for(var i = 0; i<response.length; i++){
  
              var newTarea = JSON.stringify({
                Titulo: response[i].Titulo,
                Curso: response[i].Curso,
                Link: response[i].Link,
                Fecha: response[i].Fecha
              });
              TareasPendientes.push(newTarea); // Guardar datos en el array definido globalmente
              localStorage.setItem("TareasPendientes", JSON.stringify(TareasPendientes));
    
              $("#content").append(
                '<div class="card text-dark bg-light mt-2 mb-3">'+
                  '<div class="card-body">'+
                    '<span><b>Título: </b>'+response[i].Titulo+'</span><br>'+
                    '<span><b>Curso: </b>'+response[i].Curso+'</span><br>'+
                    '<span><b>Link: </b><a href="'+response[i].Link+'" target="_blank">Click aquí</a></span><br>'+
                    '<span><b>Fecha: </b>'+response[i].Fecha+'</span><br>'+
                  '</div>'+
                '</div>'
                );
            }
          }else{
            $("#content").append(
              '<h2>Felicidades.</h2>'+
              '<p>No tienes ninguna tarea pendiente, recuerda actualizar tus tareas regularmente.</p>'
            );
          }

          $( "#settings" ).toggle( "slow", function() {
            // Animation complete.
          });
          $( "#content" ).toggle( "slow", function() {
            // Animation complete.
          });
  
        });
      }else{
        $("#alert").show();
      }
    });
  
  });
  $("#goPatmos").click(function () {
    window.open('https://patmos.upeu.edu.pe/#/', '_blank');
  });

  $("#goLamb").click(function () {
    window.open('https://lamb-academic.upeu.edu.pe/dashboard', '_blank');
  });
  
  $( "#bSettings" ).click(function() {
    $( "#content" ).toggle( "slow", function() {
      // Animation complete.
    });
    $( "#settings" ).toggle( "slow", function() {
      // Animation complete.
    });
  });
  $("#link").click(function () {
    setTimeout(function(){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(tabs[0].url.includes('proesad')){
          console.log(tabs[0].url);
        }
      });
    }, 3000);
  });
});

function Eliminar(e, p) {
  TareasPendientes.splice(e, p); // Args (posición en el array, numero de items a eliminar) https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array
  localStorage.setItem("TareasPendientes", JSON.stringify(TareasPendientes));
}
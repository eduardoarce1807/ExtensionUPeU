$("#alert").hide();
$("#contentCursos").hide();

var cursosGlobal = [];

document.getElementById('bLogin').onclick = () => {

    //Ir a Pregrado Presencial
    fetch('https://patmos.upeu.edu.pe/login/upeu', {
        method: 'GET',
        mode: 'cors'
    })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('Response was not ok.');
        })
        .then(data => {
            if (data.includes('<title>Universidad Peruana Unión - Pregrado Semipresencial</title>')) {
                location.reload();
            } else if (data.includes('<title>Universidad Peruana Unión - Pregrado Presencial</title>')) {
                //Inciamos sesion

                var formData = new FormData();

                formData.append("timezone", "America/Lima");
                formData.append("lamb", "1");
                formData.append("usuario", document.getElementById('username').value);
                formData.append("password", document.getElementById('password').value);

                fetch('https://patmos.upeu.edu.pe/session/iniciar/upeu', {
                    method: 'POST',
                    mode: 'cors',
                    body: formData
                })
                    .then(response => {
                        if (response.ok) {
                            return response.text();
                        }
                        throw new Error('Response was not ok.');
                    })
                    .then(data => {
                        // document.getElementById('id_response').value = data;
                        if (data.includes('Bienvenido a PatmOS')) {
                            console.log("TAMOS GUCCI");
                            //Inicio de Sesión Exitoso
                            //Cargar Cursos
                            appendCursos();
                            getTareasPendientes();

                            $("#alert").hide();
                            $("#login").hide(300);
                            $("#contentCursos").show(300);
                        }
                        if (data.includes('Iniciar Sesión')) {
                            console.log("BAD LOGIN");
                            $("#alert").show(200);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        })

}

async function getCursos() {
    var idCursos = [];
    var cursos = [];
    var aux = 0;

    await fetch('https://patmos.upeu.edu.pe/axios/cursos', {
        method: 'GET',
        mode: 'cors'
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            // document.getElementById('id_response').value = JSON.stringify(data);

            // var cursosJSON = JSON.parse(data);
            // console.log(cursosJSON);

            for (var i = 0; i < data.length; i++) {

                idCursos.push(data[i].cargaid);

                var newCurso = {
                    'nombre': data[i].nombre,
                    'docente': data[i].nombres + ' ' + data[i].apellidop + ' ' + data[i].apellidom,
                    'linkCurso': 'https://patmos.upeu.edu.pe/courses/home/' + idCursos[i],
                    'linkZoom': ''
                }
                cursos.push(newCurso);

                fetch('https://patmos.upeu.edu.pe/zoomconfig/get_zoom_room/' + data[i].cargaid, {
                    method: 'GET',
                    mode: 'cors'
                }).then(res => res.json())
                    .catch(error => console.error('Error:', error))
                    .then(response => {
                        cursos[aux].linkZoom = response.room.join_url;
                        aux++;
                    });

            }
        })
        .catch(error => {
            console.log(error);
        })
    
    return cursos;
}

async function appendCursos(){
    const cursos = await getCursos();
    for(var i = 0; i<cursos.length; i++){
        $("#contentCursos").append(
            '<div class="card text-dark bg-light mt-2 mb-3">'+
                '<div class="card-body">'+
                    '<span><b>Título: </b>'+cursos[i].nombre+'</span><br>'+
                    '<span><b>Docente: </b>'+cursos[i].docente+'</span><br>'+
                    '<span><b>Link Curso: </b><a id="link" href="'+cursos[i].linkCurso+'" target="_blank">Click aquí</a></span><br>'+
                    '<span><b>Link Zoom: </b><a id="link" href="'+cursos[i].linkZoom+'" target="_blank">Click aquí</a></span><br>'+
                '</div>'+
            '</div>'
        );
    }
}

function getTareasPendientes() {

    fetch('https://patmos.upeu.edu.pe/axios/pendientes', {
        method: 'GET',
        mode: 'cors'
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        })

}
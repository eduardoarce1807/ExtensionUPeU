$("#alert").hide();
$("#logout").hide();
$("#contentCursos").hide();
$("#contentTareas").hide();
$("#ballsWaveG").hide();
$(".cssload-loader").hide();
$("#brAux").hide();
$("#hidden1").hide();
$("#loadingTareas").hide();

$("#bCursos").hide();
$("#bTareas").hide();
$("#bLogout").hide();


$("#goPatmos").click(function () {
    window.open('https://patmos.upeu.edu.pe/#/', '_blank');
});

$("#goLamb").click(function () {
    window.open('https://lamb-academic.upeu.edu.pe/dashboard', '_blank');
});

$("#bLogout").click(function () {
    $("#contentTareas").hide(400);
    $("#contentCursos").hide(400);
    $("#logout").show(400);

    $("#iLogout").removeClass('bi-box-arrow-right').addClass('bi-arrow-right-square-fill');
    $("#iCursos").removeClass('bi-book-fill').addClass('bi-book');
    $("#iTareas").removeClass('bi-clipboard2-check-fill').addClass('bi-clipboard2-check');

});

$("#bCursos").click(function () {
    $("#contentCursos").show(400);
    $("#contentTareas").hide(400);
    $("#logout").hide(400);

    $("#iCursos").removeClass('bi-book').addClass('bi-book-fill');
    $("#iLogout").removeClass('bi-arrow-right-square-fill').addClass('bi-box-arrow-right');
    $("#iTareas").removeClass('bi-clipboard2-check-fill').addClass('bi-clipboard2-check');
});

$("#bTareas").click(function () {
    $("#contentCursos").hide(400);
    $("#contentTareas").show(400);
    $("#logout").hide(400);

    $("#iTareas").removeClass('bi-clipboard2-check').addClass('bi-clipboard2-check-fill');
    $("#iLogout").removeClass('bi-arrow-right-square-fill').addClass('bi-box-arrow-right');
    $("#iCursos").removeClass('bi-book-fill').addClass('bi-book');
});

let keyCursos = 'Cursos';
chrome.storage.local.get(keyCursos, function (result) {
    if (result[keyCursos]) {
        $("#login").hide();
        $("#contentCursos").show();
        console.log(result[keyCursos]);
        $("#contentCursos").append('<h3><b>Cursos:</b></h3>');
        for (var i in result[keyCursos]) {
            $("#contentCursos").append(
                '<div class="card text-dark bg-light mt-2 mb-3">' +
                '<div class="card-body">' +
                '<span><b>Título: </b>' + result[keyCursos][i].nombre + '</span><br>' +
                '<span><b>Docente: </b>' + result[keyCursos][i].docente + '</span><br>' +
                '<span><b>Link Curso <i class="bi bi-box-arrow-up-right"></i>: </b><a id="linkCurso" href="' + result[keyCursos][i].linkCurso + '" target="_blank">Click aquí</a></span><br>' +
                '<span><b>Link Zoom <i class="bi bi-camera-video-fill"></i>: </b><a id="linkZoom" href="' + result[keyCursos][i].linkZoom + '" target="_blank">Click aquí</a></span><br>' +
                '</div>' +
                '</div>'
            );
        }
        $("#iCursos").removeClass('bi-book').addClass('bi-book-fill');
        $("#bCursos").show();

        $("#bLogout").show();
        checkConnection();
        $("#loadingTareas").show(200);
        $("#buttonsPatmosLamb").hide(200);
    }
});

// let keyTareasPendientes = 'TareasPendientes';
// chrome.storage.local.get(keyTareasPendientes, function (result) {
//     if (result[keyTareasPendientes]) {
//         $("#login").hide();
//         console.log(result[keyTareasPendientes]);
//         for (var i in result[keyTareasPendientes]) {
//             $("#contentTareas").append(
//                 '<div class="card text-dark bg-light mt-2 mb-3">' +
//                 '<div class="card-body">' +
//                 '<span><b>Título: </b>' + result[keyTareasPendientes][i].titulo + '</span><br>' +
//                 '<span><b>Curso: </b>' + result[keyTareasPendientes][i].curso + '</span><br>' +
//                 '<span><b>Link Curso <i class="bi bi-box-arrow-up-right"></i>: </b><a id="linkCurso" href="' + result[keyTareasPendientes][i].link + '" target="_blank">Click aquí</a></span><br>' +
//                 '<span><b>Fecha: </b>'+result[keyTareasPendientes][i].fecha+'</span><br>'+
//                 '</div>' +
//                 '</div>'
//             );
//         }
//     }
// });

var inputUsername = document.getElementById("username");
var inputPassword = document.getElementById("password");
inputUsername.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("bLogin").click();
    }
});
inputPassword.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("bLogin").click();
    }
});

document.getElementById('bLogin').onclick = () => {
    $('#bLogin').attr('disabled', true);
    $("#ballsWaveG").show(200);
    $("#alert").hide(200);
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
                            console.log(response);
                            return response.text();
                        }
                        throw new Error('Response was not ok.');
                    })
                    .then(data => {
                        // document.getElementById('id_response').value = data;
                        if (data.includes('Bienvenido a PatmOS')) {
                            $("#hidden1").append(data.slice(15000, 15600));
                            //nombre
                            var nombre = document.getElementsByClassName('mr-1 user-name text-bold-700')[0].innerHTML;
                            nombre = nombre.substring(0, nombre.indexOf(' '));
                            nombre = nombre.substring(0, 1) + nombre.substring(1, nombre.length).toLowerCase();
                            console.log(nombre);
                            $("#navText").text('\u00a0Hola, ' + nombre + '.');
                            //foto
                            var srcFoto = document.getElementsByClassName('avatar avatar-online')[0].children[0].src;
                            console.log(srcFoto);
                            $("#imgUser").attr('src', srcFoto);
                            // console.log(data.indexOf('avatar avatar-online'));
                            // console.log(data.slice(15482, 15572));
                            console.log("SUCCESS LOGIN");
                            //Inicio de Sesión Exitoso
                            //Cargar Cursos
                            let key = 'UsuarioActivo';
                            let key_value = {};
                            var usuarioActivo = {
                                username: document.getElementById('username').value,
                                password: document.getElementById('password').value,
                                nombre: nombre,
                                foto: srcFoto
                            }
                            key_value[key] = usuarioActivo;
                            chrome.storage.local.set(key_value, function () {
                                console.log(usuarioActivo);
                            });

                            $("#alertText").removeClass('alert-danger').addClass('alert-success');
                            $("#alertText").text('Credenciales correctas, cargando datos...');
                            $("#alert").hide(200).show(200);
                            $("#ballsWaveG").hide(200);
                            appendCursos();

                            appendTareasPendientes();

                        }
                        if (data.includes('Iniciar Sesión')) {
                            console.log("BAD LOGIN");
                            $("#alertText").removeClass('alert-success').addClass('alert-danger');
                            $("#alertText").text('Error en inicio de sesión, inténtelo nuevamente.');
                            $("#alert").show(200);
                            $("#alert").shake();
                            $("#bLogin").removeAttr("disabled");
                            $("#ballsWaveG").hide(200);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        })
        .catch(error => {
            console.log(error);
        });

}

document.getElementById('bLogoutX').onclick = () => {
    $('#bLogoutX').attr('disabled', true);
    $(".cssload-loader").show(200);
    $("#brAux").show(200);
    fetch('https://patmos.upeu.edu.pe/session/logout', {
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
            if (data.includes('Iniciar Sesión')) {
                $("#login").show(400);
                $("#contentTareas").hide();
                $("#contentCursos").hide();

                $("#bCursos").hide();
                $("#bTareas").hide();
                $("#bLogout").hide();

                $("#iCursos").removeClass('bi-book-fill').addClass('bi-book');
                $("#iTareas").removeClass('bi-clipboard2-check-fill').addClass('bi-clipboard2-check');
                $("#iLogout").removeClass('bi-arrow-right-square-fill').addClass('bi-box-arrow-right');

                $("#alert").hide();

                $("#logout").hide();

                $("#username").val("");
                $("#password").val("");

                //Resetear info
                chrome.storage.local.remove(["Cursos", "TareasPendientes", "UsuarioActivo"], function () {
                    var error = chrome.runtime.lastError;
                    if (error) {
                        console.error(error);
                    }
                });
                const divCursos = document.getElementById("contentCursos");
                divCursos.innerHTML = '';
                const divTareas = document.getElementById("contentTareas");
                divTareas.innerHTML = '';
                const divHidden = document.getElementById("hidden1");
                divHidden.innerHTML = '';
                chrome.action.setBadgeText({ text: '' });
                $("#bLogin").removeAttr("disabled");
                $("#bLogoutX").removeAttr("disabled");
                $(".cssload-loader").hide();
                $("#brAux").hide();
                $("#navText").text('\u00a0Extensión PatmOS');
            }
        })
        .catch(error => {
            console.log(error);
        });

}

const urls = ['https://mocki.io/v1/d4867d8b-b5d5-4a48-a4ab-79131b5809b8', 'https://mocki.io/v1/d4867d8b-b5d5-4a48-a4ab-79131b5809b8']
const allData = urls.map(async (url)=>{
    return fetch(url)
        .then(response => response.json())
        .then((data) => {return data[1].name})
        .catch(err => console.log(err))
})   
Promise.all(allData).then(data => {console.log(data[0])})

async function getCursos() {
    var aux = 0;

    return fetch('https://patmos.upeu.edu.pe/axios/cursos', {
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
        var cursos = [];

        for (var i = 0; i < data.length; i++) {

            var newCurso = {
                'nombre': data[i].nombre,
                'docente': data[i].nombres + ' ' + data[i].apellidop + ' ' + data[i].apellidom,
                'cargaId': data[i].cargaid,
                'linkCurso': 'https://patmos.upeu.edu.pe/courses/home/' + data[i].cargaid,
                'linkZoom': ''
            }
            cursos.push(newCurso);
        }

        console.log(cursos);
        return cursos;

    })
    .catch(error => {
        console.log(error);
    })
}

async function updateCursos(cursos){
    var urls = [];
    for (let i = 0; i < cursos.length; i++) {
        urls.push('https://patmos.upeu.edu.pe/zoomconfig/get_zoom_room/'+cursos[i].cargaId);
    }
    const allData = urls.map(async (url)=>{
        return fetch(url)
            .then(response => response.json())
            .then((data) => {
                //console.log(data.room.join_url);
                return data.room.join_url;
            })
            .catch(err => console.log(err))
    })
    return Promise.all(allData).then(data => {
        for (let i = 0; i < cursos.length; i++) {
            //console.log(data[i]);
            cursos[i].linkZoom = data[i];
        }
        return cursos;
    });
}

async function appendCursos() {
    const cursos = await getCursos();
    const cursosUpdated = await updateCursos(cursos);
    $("#contentCursos").append('<h3><b>Cursos:</b></h3>');
    for (var i = 0; i < cursosUpdated.length; i++) {

        $('#contentCursos').append(
            '<div class="card text-dark bg-light mt-2 mb-3">' +
            '<div class="card-body">' +
            '<span><b>Título: </b>' + cursosUpdated[i].nombre + '</span><br>' +
            '<span><b>Docente: </b>' + cursosUpdated[i].docente + '</span><br>' +
            '<span><b>Link Curso <i class="bi bi-box-arrow-up-right"></i>: </b><a id="link" href="' + cursosUpdated[i].linkCurso + '" target="_blank">Click aquí</a></span><br>' +
            '<span><b>Link Zoom <i class="bi bi-camera-video-fill"></i>: </b><a id="link" href="' + cursosUpdated[i].linkZoom + '" target="_blank">Click aquí</a></span><br>' +
            '</div>' +
            '</div>').hide().show('slow');

    }
    $("#login").hide(400);

    $("#bCursos").show();
    $("#bTareas").show();
    $("#bLogout").show();

    $("#iCursos").removeClass('bi-book').addClass('bi-book-fill');

    let key = 'Cursos';
    let key_value = {};
    key_value[key] = cursosUpdated;
    chrome.storage.local.set(key_value, function () {
        console.log(cursosUpdated);
    });

}

async function getTareasPendientes() {

    tareas = [];

    await fetch('https://patmos.upeu.edu.pe/axios/pendientes', {
        method: 'GET',
        mode: 'cors'
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            for (var i = 0; i < data.length; i++) {
                var newTarea = {
                    'titulo': data[i].titulo,
                    'curso': data[i].nombre,
                    'link': 'https://patmos.upeu.edu.pe/courses/home/' + data[i].cursos_id + '#/admin/work-resource/' + data[i].tid,
                    'fecha': data[i].fecha_fin
                }
                tareas.push(newTarea);
            }
        })
        .catch(error => {
            console.log(error);
        })

    return tareas;

}

async function appendTareasPendientes() {
    const tareas = await getTareasPendientes();
    if (tareas.length != 0) {
        $("#contentTareas").append('<h3><b>Tareas:</b></h3>');
        for (var i = 0; i < tareas.length; i++) {
            $("#contentTareas").append(
                '<div class="card text-dark bg-light mt-2 mb-3">' +
                '<div class="card-body">' +
                '<span><b>Título: </b>' + tareas[i].titulo + '</span><br>' +
                '<span><b>Curso: </b>' + tareas[i].curso + '</span><br>' +
                '<span><b>Link <i class="bi bi-box-arrow-up-right"></i>: </b><a href="' + tareas[i].link + '" target="_blank">Click aquí</a></span><br>' +
                '<span><b>Fecha: </b>' + tareas[i].fecha + '</span><br>' +
                '</div>' +
                '</div>'
            );
        }
        let key = 'TareasPendientes';
        let key_value = {};
        key_value[key] = tareas;
        chrome.storage.local.set(key_value, function () {
            console.log(tareas);
        });
    } else {
        $("#contentTareas").append(
            '<h3><b>¡Felicidades!</b></h3>' +
            '<p>No tienes ninguna tarea pendiente.</p>' +
            '<div class="text-center">' +
            '<button style="background-color: #0f3971;" id="uwu" type="button" class="btn btn-dark"><i class="bi bi-emoji-sunglasses"></i></button><br><br>' +
            '</div>'
        );
        $("#uwu").click(function () {
            window.open('https://matias.ma/nsfw/', '_blank');
        });
    }
    $("#bTareas").show(200);
    $("#loadingTareas").hide(200);
    $("#buttonsPatmosLamb").show(200);

    chrome.action.setBadgeText({ text: String(tareas.length) });
}

async function checkConnection() {
    fetch('https://patmos.upeu.edu.pe/upeu', {
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
            if (data.includes('Iniciar Sesión')) {
                let keyUsuarioActivo = 'UsuarioActivo';
                chrome.storage.local.get(keyUsuarioActivo, function (result) {
                    if (result[keyUsuarioActivo]) {
                        console.log(result[keyUsuarioActivo]);

                        $("#navText").text('\u00a0Hola, ' + result[keyUsuarioActivo].nombre + '.');
                        //foto
                        $("#imgUser").hide(200);
                        $("#imgUser").attr('src', result[keyUsuarioActivo].foto);
                        $("#imgUser").show(300);

                        var formData = new FormData();

                        formData.append("timezone", "America/Lima");
                        formData.append("lamb", "1");
                        formData.append("usuario", result[keyUsuarioActivo].username);
                        formData.append("password", result[keyUsuarioActivo].password);

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
                                if (data.includes('Bienvenido a PatmOS')) {
                                    console.log("SUCCESS LOGIN");
                                    //Inicio de Sesión Exitoso
                                    //Cargar Cursos
                                    chrome.storage.local.remove(["TareasPendientes"], function () {
                                        var error = chrome.runtime.lastError;
                                        if (error) {
                                            console.error(error);
                                        }
                                    });
                                    const divTareas = document.getElementById("contentTareas");
                                    divTareas.innerHTML = '';

                                    appendTareasPendientes();

                                }
                                if (data.includes('Iniciar Sesión')) {
                                    console.log("BAD LOGIN");
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                });
            }
            if (data.includes('Bienvenido a PatmOS')) {
                console.log('Conectado.');
                chrome.storage.local.remove(["TareasPendientes"], function () {
                    var error = chrome.runtime.lastError;
                    if (error) {
                        console.error(error);
                    }
                });
                const divTareas = document.getElementById("contentTareas");
                divTareas.innerHTML = '';

                appendTareasPendientes();
            }
        })
        .catch(error => {
            console.log(error);
        })
}

jQuery.fn.shake = function (interval, distance, times) {
    interval = typeof interval == "undefined" ? 100 : interval;
    distance = typeof distance == "undefined" ? 10 : distance;
    times = typeof times == "undefined" ? 3 : times;
    var jTarget = $(this);
    jTarget.css('position', 'relative');
    for (var iter = 0; iter < (times + 1); iter++) {
        jTarget.animate({ left: ((iter % 2 == 0 ? distance : distance * -1)) }, interval);
    }
    return jTarget.animate({ left: 0 }, interval);
}
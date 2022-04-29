console.log("Chrome extension works");
console.log(window.location.href);

//Bug semipresencial
if(window.location.href == "https://patmos.upeu.edu.pe/proesad#/"){
    window.location.href = 'https://patmos.upeu.edu.pe/upeu#/';
}
if(window.location.href.includes('proesad')){
    window.location.href = window.location.href.replace("proesad", "upeu");
}
if(window.location.href.includes('login/#')){
    window.location.href = window.location.href.replace("#", "upeu#");
}
if(window.location.href == "https://patmos.upeu.edu.pe/login"){
    window.location.href = window.location.href.replace("login", "upeu#");
}

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
    
    message = [];

    if(document.getElementsByClassName("list-group").item(0).children[document.getElementsByClassName("list-group").item(0).children.length-1].innerText == "Ver más arrow_drop_down_circle"){
        var span= document.getElementsByClassName("list-group").item(0).children[document.getElementsByClassName("list-group").item(0).children.length-1];
        var click= new Event('click');
        span.dispatchEvent(click);

        for(var i = 1; i<document.getElementsByClassName("list-group").item(0).children.length-1; i++){

            console.log(i);
    
            var date = new Date(document.getElementsByClassName("list-group").item(0).children[i].children[4].children[0].getAttribute('datetime'));
    
            var xTitulo = document.getElementsByClassName("list-group").item(0).children[i].children[1].children[0].innerText;
            var xCurso = document.getElementsByClassName("list-group").item(0).children[i].children[3].innerText;
            var xLink = 'https://patmos.upeu.edu.pe'+document.getElementsByClassName("list-group").item(0).children[i].getAttribute('href');
            var xFecha = date.toLocaleString('en-GB');
    
            //var f = xFecha.slice(0,9);
            //var h = xFecha.slice(10,18);
    
            var aux = {
                Titulo: xTitulo,
                Curso: xCurso,
                Link: xLink,
                Fecha: xFecha + ' hrs.'
            };
    
            message.push(aux);
    
        }

    }else{
        for(var j = 1; j<document.getElementsByClassName("list-group").item(0).children.length; j++){

            console.log(j);
    
            var dateN = new Date(document.getElementsByClassName("list-group").item(0).children[j].children[4].children[0].getAttribute('datetime'));
    
            var xTituloN = document.getElementsByClassName("list-group").item(0).children[j].children[1].children[0].innerText;
            var xCursoN = document.getElementsByClassName("list-group").item(0).children[j].children[3].innerText;
            var xLinkN = 'https://patmos.upeu.edu.pe'+document.getElementsByClassName("list-group").item(0).children[j].getAttribute('href');
            var xFechaN = dateN.toLocaleString('en-GB');
    
            //var f = xFecha.slice(0,9);
            //var h = xFecha.slice(10,18);
    
            var auxN = {
                Titulo: xTituloN,
                Curso: xCursoN,
                Link: xLinkN,
                Fecha: xFechaN + ' hrs.'
            };
    
            message.push(auxN);
    
        }
    }

    

    sendResponse(message);

    
}

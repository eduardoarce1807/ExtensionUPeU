for(var i = 1; i<document.getElementsByClassName("list-group").item(0).children.length; i++){

	var date = new Date(document.getElementsByClassName("list-group").item(0).children[i].children[4].children[0].getAttribute('datetime'));

	var xTitulo = document.getElementsByClassName("list-group").item(0).children[i].children[1].children[0].innerText;
	var xLink = 'https://patmos.upeu.edu.pe'+document.getElementsByClassName("list-group").item(0).children[i].getAttribute('href');
	var xFecha = date.toLocaleString();

	console.log('Titulo: '+document.getElementsByClassName("list-group").item(0).children[i].children[1].children[0].innerText);
	console.log('Link: '+'https://patmos.upeu.edu.pe'+document.getElementsByClassName("list-group").item(0).children[i].getAttribute('href'));
	console.log('Vencimiento: '+date.toLocaleString());

	let Tarea = {
		Titulo: xTitulo,
		Link: xLink,
		Fecha: xFecha
	};

}




//window.open('https://calendar.google.com/calendar/u/0/r', '_blank');
//Fecha: date.toLocaleString().slice(0,9)
//Hora: date.toLocaleString().slice(10,15)
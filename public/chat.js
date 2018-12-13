
(function(){
   	//make connection
	var socket = io.connect('http://192.168.43.117:3000')

	var auth = false;
	eltHtml = new elements();

	console.log(eltHtml);

	eltHtml.send_message.onclick = ()=>{
		socket.emit('new_message', {message : eltHtml.getMsg()});
	};

	//Listen on new_message
	console.log(eltHtml.formMsg);
	desactiveForm(eltHtml.formMsg,!auth);
	socket.on("new_message", (data) => {
		message.value='';
		eltHtml.chatroom.innerHTML+=("<span class='message'>" + data.username + ": " + data.message + "</span><br/>")
	});
	socket.on("newConnect",(data)=>{
		console.log(data);
		eltHtml.chatroom.innerHTML+=("<span class='message'>" + data.username + " vient de se connecter </span><br/>")
	})

	socket.on("refreshMembres",(data)=>{
		eltHtml.mbConnecter.innerHTML='';
		console.log(data);
		data.membres.forEach(elt=>{
			eltHtml.mbConnecter.innerHTML+=elt+'<br/>';
		})
	})
	socket.on("changeUsername",(data)=>{
		console.log(data);
		eltHtml.chatroom.innerHTML+=("<span class='changePsuedo'>"+data.lastPseudo+" s'appelle désormais "+data.newPseudo+"</span><br/>")
	})
	//Emit a username
	eltHtml.send_username.onclick=()=>{
		socket.emit('change_username', {username : eltHtml.getPseudo()})
		desactiveForm(eltHtml.formMsg,auth);
	};
	eltHtml.message.onkeypress=(event)=>{
		if(event.keyCode == 13){
			socket.emit('new_message', {message : eltHtml.getMsg()});
		}
	}
	eltHtml.username.onkeypress=(event)=>{
		if(event.keyCode == 13){
			socket.emit('change_username', {username : eltHtml.getPseudo()})
			desactiveForm(eltHtml.formMsg,auth);
		}
	};


})();


function desactiveForm(elements, bool){
	for(let i = 0; i<elements.length;i++){
		elements[i].disabled = bool;
	}
}

function elements(){
	this.message = document.getElementById("message");
	this.username = document.getElementById("username");
	this.send_message = document.getElementById("send_message")
	this.send_username = document.getElementById("send_username")
	this.chatroom = document.getElementById("chatroom");
	this.formPseudo = document.getElementsByClassName("pseudo");
	this.formMsg = document.getElementsByClassName("msg");
	this.mbConnecter = document.getElementById("membresConnecte");

	this.getMsg = function (){
		return this.message.value;
	}

	this.getPseudo = function(){
		return this.username.value;
	}
}




(function(){
   	//make connection
	var socket = io.connect('http://localhost:3000')

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
		chatroom.innerHTML+=("<span class='message'>" + data.username + ": " + data.message + "</span><br/>")
	});
	socket.on("newConnect",(data)=>{
		console.log(data);
		chatroom.innerHTML+=("<span class='message'>" + data.username + ": viens de se connecter </span><br/>")
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

	this.getMsg = function (){
		return this.message.value;
	}

	this.getPseudo = function(){
		return this.username.value;
	}
}



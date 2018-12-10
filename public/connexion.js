function Connexion(host,port,io){
    this.socket = io.connect(host+':'+port);
}
var pseudo = document.getElementById("pseudo");
document.querySelector("input[type=button]").onclick=()=>{
    socketCo.socket.emit("change_username",pseudo.value);
    window.location='/chat'
}
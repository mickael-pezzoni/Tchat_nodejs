const express = require('express')
const app = express()


app.set('view engine', 'ejs')

app.use(express.static('public'))


app.get('/', (req, res) => {
	res.render('index')
})

server = app.listen(3000)



const io = require("socket.io")(server)

var membresConnecte = new Map();
var arrayMembresConnecte = new Array();

io.on('connection', (socket) => {
	console.log('New user connected')

	socket.username = "Anonymous"

    socket.on('change_username', (data) => {
        var lastPseudo = socket.username;
        socket.username = data.username;

        if(membresConnecte.get(socket.id)){ 
            console.log(true); 
            let verifIndex =  arrayMembresConnecte.indexOf(membresConnecte.get(socket.id));
            arrayMembresConnecte[verifIndex] = data.username;
            socket.emit("changeUsername",{lastPseudo : lastPseudo, newPseudo :data.username });
            socket.broadcast.emit("changeUsername",{lastPseudo : lastPseudo, newPseudo :data.username });
        }
        else{
            socket.emit("newConnect",{ username : data.username });
            socket.broadcast.emit("newConnect",{ username : data.username });
            arrayMembresConnecte.push(data.username)
        }
        console.log(arrayMembresConnecte);
        membresConnecte.set(socket.id,data.username);
        console.log(membresConnecte);
        socket.broadcast.emit("refreshMembres",{membres : arrayMembresConnecte});
        socket.emit("refreshMembres",{membres : arrayMembresConnecte});
    })

    socket.on('new_message', (data) => {
        console.log(socket.username);
        socket.emit('new_message', {message : data.message, username : socket.username});
        socket.broadcast.emit('new_message', {message : data.message, username : socket.username});
    })

    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
    socket.on('disconnect',()=>{
        console.log(membresConnecte.get(socket.id));
        membresConnecte.delete(socket.id);
        let verifIndex =  arrayMembresConnecte.indexOf(membresConnecte.get(socket.id));
        arrayMembresConnecte.splice(verifIndex,1);
        console.log(arrayMembresConnecte);
        socket.broadcast.emit("refreshMembres",{membres : arrayMembresConnecte})
        socket.emit("refreshMembres",{membres : arrayMembresConnecte});
    })
})

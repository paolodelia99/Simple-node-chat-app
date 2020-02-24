const express = require('express');
const app = express();
let randomColor = require('randomcolor')

//set the template engine ejs
app.set('view engine','ejs');

//middlewares
app.use(express.static('public'));

//routes
app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html');

});

//Listen on port 5000
server = app.listen(5000);

//socket.io instantiation
const io = require("socket.io")(server)

const users = [];
const connnections = []

//listen on every connection
io.on('connection', (socket) => {
    console.log('New user connected');
    connnections.push(socket)
    //initialize a random color for the socket
    let color = randomColor();

    socket.username = 'Anonymous';
    socket.color = color;

    //listen on change_username
    socket.on('change_username', data => {
        socket.username = data.nickName;
        users.push({username: socket.username, color: socket.color});
        updateUsernames();
    })

    //update Usernames in the client
    const updateUsernames = () => {
        io.sockets.emit('get users',users)
    }

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username,color: socket.color});
    })

    //listen on typing
    socket.on('typing', data => {
        socket.broadcast.emit('typing',{username: socket.username})
    })

    //Disconnect
    socket.on('disconnect', data => {
        if(!socket.username)
            return;
        users.splice(users.indexOf(socket.username),1);
        connnections.splice(connnections.indexOf(socket),1);
    })
})
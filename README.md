# Simple node chat app

This is a simple chat app built with:

- node.js
- socket.io

Check it out on heroku : https://paolown-node-chat-app.herokuapp.com/

# Quick start

```text

# install
 
npm install

# run the server

npm run server

```

# Guide

The app is really simple, I have my "backend" in the app.js file, while the the logic of the front-end are in the 
public folder.

This is the folder strucure: 

```text
.
├── README.md
├── package-lock.json
├── package.json
├── app.js
├── .gitignore
├── middleware
│   └── auth.js
├── models
│   ├── Profile.js
│   └── User.js
└── client
    ├── css
    │   └── style.css
    ├── resources
    ├── chat.js
    ├── index.html
    └── modalScript.js

```

in the app.js I have my little backend the the socket.io logic (for the backend)

```javascript
const express = require('express');
const app = express();
let randomColor = require('randomcolor');
const uuid = require('uuid');

//middlewares
app.use(express.static('public'));

//routes
app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/client/index.html');
});

//Listen on port 5000
server = app.listen( process.env.PORT || 5000);

//Now the socket.io logic begin
//socket.io instantiation
const io = require("socket.io")(server);

const users = [];
const connnections = [];

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
        let id = uuid.v4();
        socket.id = id;
        socket.username = data.nickName;
        users.push({id, username: socket.username, color: socket.color});
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
        //find the user and delete from the users list
        let user = undefined;
        for(let i= 0;i<users.length;i++){
            if(users[i].id === socket.id){
                user = users[i];
                break;
            }
        }
        users.splice(user,1);
        //Update the users list
        updateUsernames();
        connnections.splice(connnections.indexOf(socket),1);
    })
})
```

While I kept the front-end socket logic part I the chat chat.js in the client folder

```javascript
$(function () {
    //make connection
    let socket = io.connect('http://localhost:5000');

    //buttons and inputs
    let message = $("#message");
    let send_message = $("#send_message");
    let send_username = $("#send_username");
    let chatroom = $("#chatroom");
    let feedback = $("#feedback");
    let usersList = $("#users-list");
    let nickName = $("#nickname-input");

    //Emit message with the send button
    send_message.click(function(){
        socket.emit('new_message', {message : message.val()})
    });
    //Emit message with enter 
    message.keypress( e => {
        let keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode == '13'){
            socket.emit('new_message', {message : message.val()})
        }
    })

    //Listen on new_message
    socket.on("new_message", (data) => {
        feedback.html('');
        message.val('');
        console.log(data.color)
        chatroom.append(`
                        <div>
                            <div class="box3 sb14">
                              <p style='color:${data.color}' class="chat-text user-nickname">${data.username}</p>
                              <p class="chat-text" style="color: rgba(0,0,0,0.87)">${data.message}</p>
                            </div>
                        </div>
                        `)
        keepTheChatRoomToTheBottom()
    });

    //Emit a username
    nickName.keypress( e => {
        let keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode == '13'){
            socket.emit('change_username', {nickName : nickName.val()});
            socket.on('get users', data => {
                let html = '';
                for(let i=0;i<data.length;i++){
                    html += `<li class="list-item" style="color: ${data[i].color}">${data[i].username}</li>`;
                }
                usersList.html(html)
            })
        }
    });

    //Emit typing
    message.bind("keypress", e => {
        let keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode != '13'){
            socket.emit('typing')
        }
    });

    //Listen on typing
    socket.on('typing', (data) => {
        feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
    });
});
//function that keeps the chat cointainer to the bottom
const keepTheChatRoomToTheBottom = () => {
    const chatroom = document.getElementById('chatroom');
    chatroom.scrollTop = chatroom.scrollHeight - chatroom.clientHeight;
}
```

That's pretty much all you have to know! I wanna know about the 
HTML and the CSS go to the index.html and the style.css


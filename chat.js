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
    let nickName = $("#nickname-input")

    //Emit message
    send_message.click(function(){
        socket.emit('new_message', {message : message.val()})
    });

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
        chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
    });

    //Emit a username
    nickName.keypress( e => {
        let keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode == '13'){
            socket.emit('change_username', {nickName : nickName.val()});
            socket.on('get users', data => {
                let html = '';
                for(let i=0;i<data.length;i++){
                    html += "<li class='list-item'>"+data[i]+"</li>";
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
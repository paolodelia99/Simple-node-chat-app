$(function () {
    //make connection
    let socket = io.connect();

    //buttons and inputs
    let message = $("#message");
    let send_message = $("#send_message");
    let send_username = $("#send_username");
    let chatroom = $("#chatroom");
    let feedback = $("#feedback");
    let usersList = $("#users-list");
    let nickName = $("#nickname-input");

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
        console.log(data.color)
        // chatroom.append(`<p class='message' style='color:${data.color}' >${data.username }${": "}${data.message}</p>`)
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

const keepTheChatRoomToTheBottom = () => {
    const chatroom = document.getElementById('chatroom');
    chatroom.scrollTop = chatroom.scrollHeight - chatroom.clientHeight;
}
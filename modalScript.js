// Get the modal
var modal = document.getElementById("myModal");
const nicknameInput = document.getElementById("nickname-input");
const chatroom = document.getElementById('chatroom');
let scrolled = false;

// Close modal when nick-name is typed
nicknameInput.onkeypress = e => {
    let keycode = (e.keyCode ? e.keyCode : e.which);
    if(keycode == '13'){
        modal.style.display = "none";
    }
};

setInterval(function() {
    // allow 1px inaccuracy by adding 1
    const isScrolledToBottom = chatroom.scrollHeight - chatroom.clientHeight <= chatroom.scrollTop + 1;

    // scroll to bottom if isScrolledToBottom is true
    if (isScrolledToBottom) {
        chatroom.scrollTop = chatroom.scrollHeight - chatroom.clientHeight
    }
}, 1000);
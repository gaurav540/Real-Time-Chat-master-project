const socket = io('http://localhost:8000',{transports:['websocket']});

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Audio that will play on recieving messages
const audio = new Audio('../ting.mp3');

// Function which will append event info to the container
const append = (message,position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play();
    }
}

const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right');
});

// if server sends a message,recieve it
socket.on('recieve', data =>{
    append(`${data.name}: ${data.message}`, 'left');
});

// if a user leaves the chat, append the info to the container
socket.on('left', name =>{
    append(`${name} left the chat`, 'right');
});

// If the form gets submitted send server the message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value = '';
})

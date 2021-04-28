const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('join', ({ name }) => addMessage('Chat Bot', `${name} has join the conversation... :)`));
socket.on('disc', ({ name }) => addMessage('Chat Bot', `${name} has left the conversation... :(`));

let userName = '';


const login = (event) => {
    event.preventDefault();

    if (userNameInput.value == '') {
        alert('Empty field.. Type your login...')
    } else {
        userName = userNameInput.value;
        loginForm.classList.toggle('show');
        messagesSection.classList.add('show');
        socket.emit('join', { name: userName, id: socket.id });
    };
};

const sendMessage = (event) => {
    event.preventDefault();

    let messageContent = messageContentInput.value;

    if (!messageContent.length) {
        alert('Empty field...');
    }
    else {
        addMessage(userName, messageContent);
        socket.emit('message', { author: userName, content: messageContent })
        messageContentInput.value = '';
    }
}

const addMessage = (author, content) => {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if (author === userName) {
        message.classList.add('message--self');
    } else if (author === 'Chat Bot') {
        message.classList.add('message--chatBot');
    }
    message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author}</h3>
    <div class="message__content">
      ${content}
    </div>
  `
    messagesList.appendChild(message);
}

loginForm.addEventListener('submit', event => { login(event) });

addMessageForm.addEventListener('submit', event => { sendMessage(event) });
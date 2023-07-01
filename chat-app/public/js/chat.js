const socket = io(); // Establishing New Connection to Socket.io

const msgContainer = document.getElementById('messages');
const msgTemplate = document.getElementById('message-template').innerHTML;

const autoscroll = () => {
    // New message element
    const newMessage = msgContainer.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = msgContainer.offsetHeight;

    // Height of messages container
    const containerHeight = msgContainer.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = msgContainer.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }
};

socket.on('message', (data) => {
    console.log(data);

    const html = Mustache.render(msgTemplate, {
        username: data.username,
        message: data.text,
        createdAt: moment(data.createdAt).format('h:mm a') 
    });
    msgContainer.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

const locationTemplate = document.getElementById('location-message-template').innerHTML;

socket.on('locationMessage', (data) => {
    console.log(data);

    // Using Mustache Library renering dynamic template and passing data as second parameter {}
    const html = Mustache.render(locationTemplate, {
        username: data.username,
        url: data.url,
        createdAt: moment(data.createdAt).format('h:mm a') 
    });
    msgContainer.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

const userMessage = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
sendBtn.addEventListener('click', (e) => {
    sendBtn.setAttribute('disabled','disabled');
    e.preventDefault(); // required to prevent page reload on form submission
    socket.emit('sendMessage', userMessage.value, (error) => {
        sendBtn.removeAttribute('disabled');
        userMessage.value = '';
        userMessage.focus();
        error ? console.log(error) : console.log('Message Delivered!');;
    });
});

const sendLocationBtn = document.getElementById('send-location');
sendLocationBtn.addEventListener('click', () => {
    sendLocationBtn.setAttribute('disabled','disabled');
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('sendLocation', { latitude, longitude }, (error) => {
            sendLocationBtn.removeAttribute('disabled');
            error ? console.log(error) : console.log('Location Sent Successfully!');;
        });
    });
});

const sidebarTemplate = document.getElementById('sidebar-template').innerHTML;
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
});

// Options
// In location.search contains query string from browser like '?A=10&B=12'
// we are parsing that and converting obj using query string library
// ignoreQueryPrefix to remove ? from string
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        // if any error happends navigate to home page
        location.href = '/';
    }
});
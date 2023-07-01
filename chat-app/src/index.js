const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const publicDirPath = path.join(__dirname, '../public');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app); // Creating Http server manually with express app instance(for socket.io)
const io = socketio(server); // creating new websocket or socketio instance using web server

// io.on ('event', callback Fn)
// This connection callback will be run as many clients connected(4 clients - 4connections - run 4times)
io.on('connection', (socket) => {
    console.log('New Web Socket Connection established via client');

    socket.on('join', (options, acktCallBackFn) => {
        // socket will be having unique id for the particular connection or user
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return acktCallBackFn(error)
        }
        // socket.io providig join fn to target to specific room and joining user to that
        socket.join(user.room);
        socket.emit('message', generateMessage('Admin', 'Welcome!'));
        // socket.broadcast.to(room).emit() send values to all users except current user, who are part of that specific room
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} Joined!`));

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        acktCallBackFn();
    });
    
    // send messages to current client using socket.emit()
    // socket.emit('message', generateMessage('Welcome!'));
    // send messages to all clients except current client using socket.broadcast.emit()
    // socket.broadcast.emit('message', generateMessage('A New User Joined!'));

    socket.on('sendMessage', (data, acktCallBackFn) => {
        const user = getUser(socket.id);
        // New instance for bad words filter.
        const filter = new Filter();
        if (filter.isProfane(data)) {
            return acktCallBackFn('Profanity is not allowed!');
        }
        // send messages to all clients using io.emit()
        io.to(user.room).emit('message', generateMessage(user.username, data));
        // once all the server side work is done for particular event/msg we can send acknowledgement
        // we can send data as well in this fn, client will provide this callback as 3rd param of emit fn
        acktCallBackFn();
    });

    socket.on('sendLocation', (data, acktCallBackFn) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${data.latitude},${data.longitude}`));
        acktCallBackFn();
    });

    // listening disconnect event on each client
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            // io.to(room).emit send msgs to all users who are part of specific room
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} left the chat!`));

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
});

app.use(express.static(publicDirPath));

// We should use server instance here to start and listen to the server.
server.listen(port, () => console.log(`Express Server is Up and Running in Port ${port}`));

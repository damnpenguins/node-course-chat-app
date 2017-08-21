const path      = require('path');
const http      = require('http');
const express   = require('express');
const socketIO  = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString}  = require('./utils/validation');
const {Users}         = require('./utils/users');

const publicPath  = path.join(__dirname, '../public');
const port        = process.env.PORT || 3000;
var app           = express();
var server        = http.createServer(app);
var io            = socketIO(server);
var users         = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected');

  // socket.emit('newMessage' , {
  //   from: 'mike@example.com',
  //   text: 'Hey FCKR! - custom msg',
  //   createdAt: 123
  // });



  socket.on('join', (params,callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)){
      return callback('name and room name are required');
    }

    socket.join(params.room);
    // remove user from any old rooms
    users.removeUser(socket.id);
    // add user to new room
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));


    socket.emit('newMessage',generateMessage('Admin', 'Welcome to the Chat App'));

    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name} joined the room.`));

    callback();
  });

  // socket.on('updateUserList', () => {
  //   console.log('User List', users);
  // });


  socket.on('createMessage', (newMSG, callback) => {
    console.log('createMessage',newMSG);
    var user = users.getUser(socket.id);

    if (user && isRealString(newMSG.text)) {
      // io emit broadcasts to all, socket emits to a single one
      // io.emit('newMessage',generateMessage(newMSG.from, newMSG.text));
      //socket.broadcast.emit('newMessage',generateMessage(newMSG.from,
      io.to(user.room).emit('newMessage',generateMessage(user.name, newMSG.text));
      callback('This is from the server');
    }


    // socket.broadcast.emit('newMessage',{
    //     from: newMSG.from,
    //     text: newMSG.text,
    //     createdAt: new Date().getTime()
    // });

  });
  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  // socket.emit('newEmail',{
  //   from: 'mike@example.com',
  //   text: 'Hey FCKR!',
  //   createAt: 123
  // });
  //
  // socket.on('createEmail', (newEmail) => {
  //   console.log('createEmail',newEmail);
  // });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });



});


server.listen(3000, () => {
  console.log(`server is up on port ${port}`);
});

const http      = require('http');
const path      = require('path');
const express   = require('express');
const socketIO  = require('socket.io');

const publicPath  = path.join(__dirname,'../public');
const port        = process.env.PORT || 3000;

var app     =  express();
var server  = http.createServer(app);
var io      = socketIO(server);
// es6 destructuring
const {generateMessage} = require('./utils/message');
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected');

  // socket.emit('newMessage' , {
  //   from: 'mike@example.com',
  //   text: 'Hey FCKR! - custom msg',
  //   createdAt: 123
  // });

  socket.emit('newMessage',generateMessage('Admin', 'Welcome to the Chat App'));

  socket.broadcast.emit('newMessage',generateMessage('Admin', 'New user Joined'));


  socket.on('createMessage', (newMSG) => {
    console.log('createMessage',newMSG);
    // io emit broadcasts to all, socket emits to a single one
    // io.emit('newMessage',generateMessage(newMSG.from, newMSG.text));
    socket.broadcast.emit('newMessage',generateMessage(newMSG.from, newMSG.text));



    // socket.broadcast.emit('newMessage',{
    //     from: newMSG.from,
    //     text: newMSG.text,
    //     createdAt: new Date().getTime()
    // });

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
  });

});


server.listen(3000, () => {
  console.log(`server is up on port ${port}`);
});

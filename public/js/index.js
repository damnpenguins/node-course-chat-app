var socket = io();

socket.on('connect',function() {
  console.log('connected to server');

  // socket.emit('createEmail',{
  //   to: 'jen@example.com',
  //   text: 'Hey FCKR!'
  // })

  // socket.emit('createMessage',{
  //   from: 'jen@example.com',
  //   text: 'Hey FCKR! - client message'
  // });

});

socket.on('disconnect',function()  {
  console.log('Disconnected from server');
});

// socket.on('newEmail', function(email){
//   console.log('new Email', email);
// });

socket.on('newMessage', function(msg){
  console.log('new Message recieved', msg);
});

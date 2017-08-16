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

  var li = jQuery('<li></li>');
  li.text(`${msg.from}: ${msg.text}`);
  jQuery('#messages').append(li);
});


socket.emit('createMessage',{
  from: 'Frank',
  text: 'Hi FCKR!'
}, function (data) {
  console.log('Got it!', data);
});
// NOTE we cant use an arrow func here because of browser compaitibility


jQuery('#message-form').on('submit',function (e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});

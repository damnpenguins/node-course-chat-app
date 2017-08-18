var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  li.text(`${message.from}  ${formattedTime}: ${message.text}`);

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');
  var formattedTime = moment(message.createdAt).format('h:mm a');
  li.text(`${message.from} ${formattedTime}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});



// my version
// var socket = io();
//
// socket.on('connect',function() {
//   console.log('connected to server');
//
//   // socket.emit('createEmail',{
//   //   to: 'jen@example.com',
//   //   text: 'Hey FCKR!'
//   // })
//
//   // socket.emit('createMessage',{
//   //   from: 'jen@example.com',
//   //   text: 'Hey FCKR! - client message'
//   // });
//
// });
//
// socket.on('disconnect',function()  {
//   console.log('Disconnected from server');
// });
//
// // socket.on('newEmail', function(email){
// //   console.log('new Email', email);
// // });
//
// socket.on('newMessage', function(msg){
//   //console.log('new Message recieved', msg);
//
//   var li = jQuery('<li></li>');
//   li.text(`${msg.from}: ${msg.text}`);
//   jQuery('#messages').append(li);
// });
//
//
// socket.emit('createMessage',{
//   from: 'Frank',
//   text: 'Hi FCKR!'
// }, function (data) {
//   console.log('Got it!', data);
// });
//
// socket.on('newLocationMessage', function (message) {
//   var li = jQuery('<li></li>');
//   var a = jQuery('<a target="_blank">My current location</a>');
//
//   li.text(`${message.from}: `);
//   a.attr('href', message.url);
//   li.append(a);
//   jQuery('#messages').append(li);
// });
//
//
//
// // NOTE we cant use an arrow func here because of browser compaitibility
//
//
// jQuery('#message-form').on('submit',function (e) {
//   e.preventDefault();
//   socket.emit('createMessage', {
//     from: 'User',
//     text: jQuery('[name=message]').val()
//   }, function () {
//
//   });
// });
//
// var locationButton = jQuery('#send-location');
// locationButton.on('click', function () {
//   if (!navigator.geolocation) {
//     return alert('Geolocation not supported by your browser.');
//   }
//
//   locationButton.attr('disabled', 'disabled').text('Sending location...');
//
//
//   navigator.geolocation.getCurrentPosition(function (position) {
//     socket.emit('createLocationMessage', {
//       latitude: position.coords.latitude,
//       longitude: position.coords.longitude
//     });
//   }, function () {
//     alert('Unable to fetch location.');
//   });
// });

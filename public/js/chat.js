var socket = io();


function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
    console.log('Should scroll down all the way');
  }
}


socket.on('connect', function () {
  console.log('Connected to server');
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function (err){
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log('no error');
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});


socket.on('updateUserList', function (users) {
  console.log('User List', users);
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});
// socket.on('newMessage', function (message) {
//   // console.log('newMessage', message);
//   // var formattedTime = moment(message.createdAt).format('h:mm a');
//   // var li = jQuery('<li></li>');
//   // li.text(`${message.from}  ${formattedTime}: ${message.text}`);
//   //
//   // jQuery('#messages').append(li);
//   var formattedTime = moment(message.createdAt).format('h:mm a');
//   var template = jQuery('#message-template').html();
//   var html = Mustache.render(template, {
//     text:message.text,
//     from: message.from,
//     createdAt: formattedTime
//   });
//
//   jQuery('#messages').append(html);
//   scrollToBottom();
// });
//
// socket.on('newLocationMessage', function (message) {
//   // var li = jQuery('<li></li>');
//   // var a = jQuery('<a target="_blank">My current location</a>');
//   // var formattedTime = moment(message.createdAt).format('h:mm a');
//   // li.text(`${message.from} ${formattedTime}: `);
//   // a.attr('href', message.url);
//   // li.append(a);
//   // jQuery('#messages').append(li);
//
//   var formattedTime = moment(message.createdAt).format('h:mm a');
//   var template = jQuery('#location-message-template').html();
//   var html = Mustache.render(template, {
//     from:message.from,
//     url: message.url,
//     createdAt: formattedTime
//   });
//
//   jQuery('#messages').append(html);
//   scrollToBottom();
// });

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
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

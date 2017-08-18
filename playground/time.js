const moment = require('moment');

// var date = new Date();
// console.log(date.getMonth());

// current time in moment
// var date = moment();
//
// console.log(date.format('Do MMM YYYY'));


var someTimeStamp = moment().valueOf();

var createdAt = 1234;
var date = moment(createdAt);
console.log(date.format('h:mm a'));
console.log(someTimeStamp);

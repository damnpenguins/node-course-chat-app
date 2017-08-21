const _ = require('lodash');


class Users {

  constructor () {
    this.users = [];
  }

  addUser(id, name, room) {
    var user = {id,name,room};
    this.users.push(user);
    return user;
  }

  removeUser(id){
    //_.pull(this.users, id);
    // var pulled = _.pullAt(this.users, id);
    // return pulled;
    //var user = this.users.filter((user) =>   user.id === id)[0];
    var user = this.getUser(id);

    if (user){
      this.users = this.users.filter((user) => user.id != id);
    }

    return user;
  }


  getUser(id){
    // only need the first arr obj as you should only return 1 user
    return this.users.filter((user) =>   user.id === id)[0]
  }

  getUserList(room){
    // old style
    // var users = this.users.filter((user) => {
    //   return user.room === room;
    // });
    // es6 style - drop the function, this is shorthand
    //arrow func return
    // that is becuase the return is implicit so you dont need to explicitly
    // state that you want the val returned
    var users = this.users.filter((user) =>   user.room === room);
    var namesArray = users.map((user) => user.name);

    return namesArray;
  }

}

module.exports =  {Users};


// class Person {
//
//   constructor (name, age) {
//     this.name = name;
//     this.age = age;
//   }
//   getUserDescription() {
//     return `${this.name} is ${this.age} year(s) old.`;
//   }
// }
//
//
// var me = new Person('Cam',42);
//
// console.log('this.name', me.name);
// console.log('this.age', me.age);
//
// var desc = me.getUserDescription();
// console.log(desc);

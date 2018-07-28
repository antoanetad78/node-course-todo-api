const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//Rmove all records and print out the result:

// Todo.remove({}).then((result) => {
//     console.log(result);
// })


//Todo.findOneAndRemove()
//Todo.findByIdAndRemove()

Todo.findByIdAndRemove('5b5c4225117dfc1ba0bb2b3e').then((todo) => {
  console.log(todo);
})

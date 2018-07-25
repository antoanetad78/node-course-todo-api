const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5b56089b37511a3490564bc8222';

// if(!ObjectID.isValid(id)) {
//   console.log('Invalid ID');
// };
//
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos: ', todos);
// });
//
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo: ', todo);
// });
//
// Todo.findById(id).then((todo) => {
//   if(!todo) {
//     return console.log('ID not found'); // If the ID doesn't exist, the findOne and findById would return null, not an error.
//   }
//   console.log('Todo by ID: ', todo);
// }).catch((e) => console.log(e));// error

User.findById(id).then((user) => {
  if(!user) {
    return console.log('User not found');
  }
  console.log('User: ', user);
}).catch((e) => console.log(e));

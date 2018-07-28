var express = require('express');
var bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e)=> {
    res(400).send(e);
  });
});

//GET /todos/12548
app.get('/todos/:id', (req,res) => {
  var id = req.params.id;
  //Validate id usin isValid
    //404 - send back empty body - send();
  if (!ObjectID.isValid(id)) {
    return res.status(400).send('<h3>Invalid User ID</h3>');
  }

  //findById
      //success
         //if todo send it back
         //if no todo - send back 404 with empty body
     //error - 404 and empty body
  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send('Sorry, we cannot find that!');
    }
    res.send(todo);
  }).catch((e) => res.status(404).send('<h4>An error occured</h4>'));
});

app.listen(port, () => {
  console.log(`Started on ${port}`);
});

module.exports = {app};

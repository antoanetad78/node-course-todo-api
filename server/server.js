const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
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
    res.send({todo});
  }).catch((e) => res.status(404).send('<h4>An error occured</h4>'));
});

//findByIdAndRemove

app.delete('/todos/:id', (req,res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(400).send('<h3>Remove failed: Invalid Object ID</h3>')
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send('<h4>Todo not found!</h4>')
    }
    res.send(`Removed one todo:<hr> ${{todo}}`);
  }).catch((e)=> res.status(400).send('<h4>An error occured</h4>'));
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']); // _.pick takes an object (request.body in this case - and sends to the var body only the parameters inthe array. The user will see only these params)

    if(!ObjectID.isValid(id)) {
      return res.status(400).send('<h3>Remove failed: Invalid Object ID</h3>')
    }

    if(_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
      if(!todo) {
        return res.status(404).send('<h3>Todo not found</h3>');
      }
      res.send({todo});
    }).catch((e) => {
      res.status(400).send('<h3>Error updating record. Update failed.</h3>');
    })
});

app.listen(port, () => {
  console.log(`Started on ${port}`);
});

module.exports = {app};

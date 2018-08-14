require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate')

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (e)=> {
    res(400).send(e);
  });
});

//GET /todos/id
app.get('/todos/:id', authenticate, (req,res) => {
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
  Todo.findOne({
    _id:id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send('Sorry, we cannot find that!');
    }
    res.send({todo});
  }).catch((e) => res.status(404).send('<h4>An error occured</h4>'));
});

//findByIdAndRemove

app.delete('/todos/:id', authenticate, (req,res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(400).send('<h3>Remove failed: Invalid Object ID</h3>')
  }
  Todo.findOneAndRemove({
    _id:id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send('<h4>Todo not found!</h4>')
    }
    res.send({todo});
  }).catch((e)=> res.status(400).send('<h4>An error occured</h4>'));
});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']); // _.pick takes an object (request.body in this case - and sends to the var body only the parameters inthe array. The user will see only these params)

    if(!ObjectID.isValid(id)) {
      return res.status(400).send('<h3>Invalid Object ID</h3>')
    }

    if(_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null
    }

    Todo.findOneAndUpdate({
      _id:id,
      _creator: req.user._id
    },
    {$set: body},
    {new: true}).then((todo) => {
      if(!todo) {
        return res.status(404).send('<h3>Todo not found</h3>');
      }
      res.send({todo});
    }).catch((e) => {
      res.status(400).send('<h3>Error updating record. Update failed.</h3>');
    })
});

//POST /users -- creates new user
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])
  var user = new User(body)
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    // res.header('x-auth', token).send(`User ${body.email} created \n ${user}`) - think of a diferent way, template string doesn't use JSON.stringify()
    res.header('x-auth', token).send(user);
  }).catch((e) => res.send(e))


})

//POST /users/login
app.post('/users/login', (req,res) => {
  let body = _.pick(req.body, ['email', 'password'])

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    })
  }).catch((e) => {
    res.status(400).send();
  })
  });

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
});

app.listen(port, () => {
  console.log(`Started on ${port}`);
});

module.exports = {app};

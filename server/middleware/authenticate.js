let {User} = require('./../models/user');


//middleware. the authetication is made here and is used by all private routes.
//the code in the routes will execute only after the next() call
//use authenticate as an argument in all route functions.
let authenticate = (req, res, next) => {
  let token = req.header('x-auth')

  User.findByToken(token).then((user) => {
    if(!user){
      return Promise.reject(); //the function will stop and jump directly to the catch block
    }

    req.user = user;
    req.token = token;
    next();

  }).catch((e) => {
    res.status(401).send();
  })
}

module.exports = {authenticate}

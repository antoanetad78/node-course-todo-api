const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  tokens: [{
    access:{
      type: String,
      required:true
    },
    token: {
      type: String,
      required:true
    }
  }]
});

//Picks using _.pick which values from the user obhect to show bach to the user.
UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
}

//Generates token and returns for the server.js to use.
UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};

//Used for delete token which is the logout of a user
//an instance method, so is defined with .methods
UserSchema.methods.removeToken = function (token) {               //the function needs to know which token to delete so function(token)
  let user = this;
//return, so we can chain on the promise in server.js
  return user.update({//we just pass the updates object
    $pull: { //what we want to pull from. it removes items from an array based on certain criteria.a mongodb method
      tokens: {//the tokens array. we want to pull any object on the array that has a property token equal to the token passed as an argument:
        token:token //if the method find that token equals token passed as an arguent, it will remove the entire object that contains that property
      }
    }
  })

}

UserSchema.statics.findByToken = function (token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch(e) {
    // return new Promise((resoleve, reject) => {
    //   reject();
    // })     the same could be done:
    return Promise.reject();
  }

//findOne returnes a promise which is why we return. the chain will be added in server.js
//when using nested object properties as property, we put them in ''
  return User.findOne ({
    '_id': decoded._id,
    'tokens.token':token,
    'tokens.access':'auth'
  })

}

//middleware. A hook pre. on the save(). Pre every save user it cheks of the password is modified and only creates and hashes new password if it is modified
//bcrypt.[whatever] doesn't return a promise. If we want to use async/await, we should wrap bcrypt in a promise
//for now we use this:
UserSchema.pre('save', function(next){
  let user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        user.password = hash;
        next();
      });
    });
  }else {
    next();
  }
})

UserSchema.statics.findByCredentials = function(email, password) {
  let User = this;

  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject;
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res){
          resolve(user);
        } else{
          reject();
        }

      })
    })
  })
}


let User = mongoose.model('User', UserSchema);

module.exports = {User};

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

//Generates token and returns for the serve.js to use.
UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function (token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, 'abc123')
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


let User = mongoose.model('User', UserSchema);

module.exports = {User};

const jwt = require('jsonwebtoken');
const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');

//
// let message = 'I\'m a message';
// let hashed = SHA256(message);
//
// console.log(`Original message: \n ${message}\n ----`);
// console.log(`Hashed message: \n ${hashed}`);
//
// let data = {
//   id: 456
// }
//
// let token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'secret').toString()
// }
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString()
//
// // token.data.id = 578;
// // token.hash = SHA256(JSON.stringify(token.data)).toString()
//
// if(resultHash === token.hash){
//   console.log('Data is not changed, go ahead');
// }else {
//   console.log('Data is manipulated, stay away')
// };
//

let password = '123abc!';

bcrypt.genSalt(10, function(err, salt) {
  bcrypt.hash(password, salt, function(err, hash) {
    console.log(hash);
  })
})

let hashedPassword = '$2a$10$9Wdsw26i10NxRllazH/5A.ZrFjfJceMdxXMupBaR4MMriqRBrLBAe';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
})

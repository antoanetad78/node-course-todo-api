//this is an example. all the below things are handled by jwt - jason web token

const {SHA256} = require('crypto-js');

let message = 'I\'m a message';
let hashed = SHA256(message);

console.log(`Original message: \n ${message}\n ----`);
console.log(`Hashed message: \n ${hashed}`);

let data = {
  id: 456
}

let token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'secret').toString()
}

let resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString()

// token.data.id = 578;
// token.hash = SHA256(JSON.stringify(token.data)).toString()

if(resultHash === token.hash){
  console.log('Data is not changed, go ahead');
}else {
  console.log('Data is manipulated, stay away')
};

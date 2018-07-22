const MongoClient = require('mongodb').MongoClient;

//connection URL
const url = 'mongodb://localhost:27017';

//Databe name
const dbName = 'TodoApp';

MongoClient.connect(url,{ useNewUrlParser: true }, (err, client) => {
  if(err) {
    return console.log('Unable to connect to the MongoDB server');
  }
    console.log('Connected to the MongoDB server');

const db = client.db(dbName);

// db.collection('Todos').insertOne({
//     text:'Something to do',
//     completed: false
// }, (err, result) => {
//     if(err) {
//       return console.log('Unable to insert todo', err);
//     }
//     console.log(JSON.stringify(result.ops, undefined, 2));
//    });

db.collection('Users').insertOne({
  name: 'Jana',
  age:39,
  location: 'Burgas'
}, (err, result) => {
  if(err){
    return console.log('Unable to insert user', err);
  }
    console.log(JSON.stringify(result.ops, undefined, 2));
});

client.close();
});

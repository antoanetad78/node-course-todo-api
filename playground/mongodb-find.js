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

// db.collection('Todos').find({completed: false}).toArray().then((docs) => {
//   console.log('Todos:');
//   console.log(JSON.stringify(docs, undefined, 2));
// }, (err) => {
//   console.log('Unable to find Todos', err);
// });

// db.collection('Todos').find().count().then((count) => {
//   console.log(`Todos: ${count}`);
// }, (err) => {
//   console.log('Unable to find Todos', err);
// });
var toFind = {name: 'Antoaneta'};
db.collection('Users').find(toFind).toArray().then((docs) => {
  console.log(`Listing all documents found :`);
  console.log(JSON.stringify(docs, undefined, 2));
}, (err) => {
  console.log('Unable to find any documents', err);
});

db.collection('Users').find({name: 'Antoaneta'}).count().then((count) => {
  console.log(`Number of documents found: ${count}`);
}, (err) => {
  console.log(err);
});


client.close();
});

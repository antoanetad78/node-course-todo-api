const {MongoClient, ObjectID} = require('mongodb');

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


// deleteMany - deletes every document that matches the query
// db.collection('Todos').deleteMany({ text: 'Eat lunch' }).then((result) => {
//   console.log(result);
// });

// deleteOne - deletes the first document that matches the query
// db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result)=> {
//   console.log(result);
// })

//findOneAndDelete - deletees the document that mathes the query and shows the deleted document
// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
//   console.log(result);
// });

// db.collection('Users').deleteMany({name: 'Antoaneta'}).then((result) => {
//   console.log(result);
// });



db.collection('Users').findOneAndDelete({_id: new ObjectID("5b547f77c7cb733b04c64ae2")}).then((result) => {
  console.log(result);
});




client.close();
});

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


// findOneAndUpdate
// db.collection('Todos').findOneAndUpdate({_id: new ObjectID('5b556d697769032244e6ac93')},
//    {
//      $set: {
//        completed: true
//      }
//    },
//    {
//      returnOriginal: false
//    }).then((result) => {
//      console.log(result);
//    });


/*

// find and store the id:
// var toUpdate = db.collection('Users').find().toArray().then((docs) => {
//   return docs = docs[1]._id;
// }).then((finalId) => {
//   return JSON.stringify(toUpdate);
// });
// console.log(toUpdate);

*/

// db.collection('Users').findOneAndUpdate({_id:new ObjectID('5b54d492f6a8e521602f18ad')}, {
//   $set: { name: 'Veli'},
//   $inc: {age: 1}
// }, {
//   returnOriginal: false
// }).then((result) => {
//   console.log(result);
// });





client.close();
});

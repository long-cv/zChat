const {MongoClient} = require('mongodb');
const dbConfig = require('./config');
var db;
const mongoClient = new MongoClient(dbConfig.URL);
module.exports = {
  dbConnect: () => {
    return new Promise((resolve, reject) => {
      mongoClient.connect((error, client) => {
        if (error) return reject(error);
        console.log('Connect to DB successfully.');
        db = client.db(dbConfig.zChatDB);
        //console.log(db);
        resolve('OK');
      });
    });
  },
  dbDisconnect: () => {
    console.log('Close the DB connection.');
    return mongoClient.close();
  },
  dbCreate: (collection, docArray, options) => {
    return db.collection(collection).insertMany(docArray, options);
  },
  dbRead: (collection, query, options) => {
    return db.collection(collection).find(query, options);
  },
  dbUpdate: (collection, filter, update, options) => {
    return db.collection(collection).updateMany(filter, update, options);
  },
  dbAggregate: (collection, stageArray) => {
    return db.collection(collection).aggregate(stageArray);
  }
};
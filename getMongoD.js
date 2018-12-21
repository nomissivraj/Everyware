//Functions to get data from Mongo
var exports = module.exports = {};

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://testuser:testuser1@ds147440.mlab.com:47440/dat602';

//Function to get last entry with parameters
exports.getEntries = (dbname, collection, num) => {
/*
  Using a promise to resolve the data - otherwise without promise, page render could happen before data is retrieved
*/
  return new Promise((resolve, reject) => {
    //Connect to database
    MongoClient.connect(url, function(err, db) {
      //Error handling
      if (err) throw err;
      var dbo = db.db(dbname);
      //Find last document | limit(1) means only get one result | $natural:-1 means reverse order = last document/entry 
      dbo.collection(collection).find().sort({$natural:-1}).limit(num).toArray( function(err, result) {
        if (err) throw err;
        data = result;
        db.close();

        //evaluate promise - if data exists resolve data otherwise send error
        if(data) {
          resolve(data);
        } else {
          reject(Error("No data"));
        }
      });
    });
  });
};
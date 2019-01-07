var exports = module.exports = {};
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://testuser:testuser1@ds147440.mlab.com:47440/dat602';//api url for our mongodb database

//Function to drop all collections within the database - if a user wishes to start over or perhaps give device to another user etc.
exports.dropCollections = (dbname) => {
    //Using promise to avoid asycnhronous progression before the system is ready
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function(err, db) {
            var done = false;
            //Error handling
            if (err) throw err;
            var dbo = db.db(dbname);
            //seperate drop calls for each collection
            dbo.collection("Profile").drop();
            dbo.collection("DiaryEntries").drop();
            dbo.collection("Personality").drop();
            dbo.collection("Flowers").drop();
            dbo.collection("Tone").drop();
            dbo.collection("ActiveFlower").drop();

            done = true;//Set true once complete 
            //evaluate promise - if data exists resolve data otherwise send error
        if(done) {// if done is true resolve else reject
            resolve(done);
        } else {
            reject(Error("No data"));
        }
        });
    });
    
}
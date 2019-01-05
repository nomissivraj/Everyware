var exports = module.exports = {};
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://testuser:testuser1@ds147440.mlab.com:47440/dat602';

exports.dropCollections = (dbname) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function(err, db) {
            var done = false;
            //Error handling
            if (err) throw err;
            var dbo = db.db(dbname);

            dbo.collection("Profile").drop();
            dbo.collection("DiaryEntries").drop();
            dbo.collection("Personality").drop();
            dbo.collection("Flowers").drop();
            dbo.collection("Tone").drop();
            dbo.collection("ActiveFlower").drop();

            done = true;
            //evaluate promise - if data exists resolve data otherwise send error
        if(done) {
            resolve(done);
        } else {
            reject(Error("No data"));
        }
        });
    });
    
}
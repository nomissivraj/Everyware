var exports = module.exports = {};

//Mongo dependency & url
const MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://testuser:testuser1@ds147440.mlab.com:47440/dat602';

//dependencies for general nodejs server routing etc...
var express = require('express');
var app = express();
var http = require('http').Server(app);


//function to add item to database, takes in a collection name parameter and a document object
exports.insert = function(dbname, colName, data) {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err; //throw error if can't connect
        
        var dbo = db.db(dbname);
                
        dbo.collection(colName).insertOne(data, (err, res) => { //add document to collection using the passed in collection name
            if (err) throw err;
            console.log('1 Document inserted');
            db.close;
        });   
    });

}

//Function to update profile rather than add new or duplicate
exports.updateProfile = function(dbname, colName, data) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, db) => {
            if (err) throw err; //throw error if can't connect
            
            var dbo = db.db(dbname);
            //The first perameter is essentially the search term for which document to update - since this collection is only intended for one collection and the perameter is an empty object it replaces any existing document
            dbo.collection(colName).replaceOne({ }, data, {upsert: true}, (err, res) => { //update collection with new data
                if (err) throw err;
                console.log('Profile updated');
                var data = res;
                db.close;
                // Resolve or reject promise if data is returned or not. 
                if(data) {
                    resolve(data);
                  } else {
                    reject(Error("No data"));
                  }
            });   
        });
    });
}


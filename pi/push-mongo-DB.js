var exports = module.exports = {};

//Mongo dependency & url
const MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://testuser:testuser1@ds147440.mlab.com:47440/dat602';

//dependencies for general nodejs server routing etc...
var express = require('express');
var app = express();
var http = require('http').Server(app);


//function to add item to database, takes in a collection name parameter and a document object
exports.PushtoMongo = function(colName, data){

    MongoClient.connect(url, (err, db) => {
        if (err) throw err; //throw error if can't connect
        
        var dbo = db.db('dat602');
                
        dbo.collection(colName).insertOne(data, (err, res) => { //add document to collection using the passed in collection name
            if (err) throw err;
            console.log('1 Document inserted into ' + colName);
            db.close;
        });   
    });

}

exports.PushtoMongoReplaceNewFlower = function(colName, data){

    MongoClient.connect(url, (err, db) => {
        if (err) throw err; //throw error if can't connect
        
        var dbo = db.db('dat602');
        
        dbo.collection("ActiveFlower").find({}).toArray((err, result) => { //get active flower data
            if (err) throw err;
            if(result.length < 1) { //if it doesnt exist, return.
                return;
            } else {
                //save old active flower data in object
                var flowerData = {
                    color: result[0].color,
                    petals: result[0].petals
                }
                dbo.collection('Flowers').insertOne(flowerData, (err, res) => { //add old flower data to collection
                    if (err) throw err;
                    console.log('old flower saved');
                    db.close;
                });
            }
            
        })
        
        dbo.collection(colName).replaceOne({ }, data, {upsert: true}, (err, res) => { //create new flower data using passed in object
            if (err) throw err;
            console.log('new Flower ' + colName);
            db.close;
        });   
    });

}


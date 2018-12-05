//MQTT Dependencies
var mqtt = require('mqtt')
var MQTT_TOPIC = "testtopic"; //MQTT topic is test
var MQTT_ADDR = "mqtt://broker.i-dat.org:80"; //Use the broker address here
var MQTT_PORT = 80; //And broker's port

//dependencies for general nodejs server routing etc...
var express = require('express');
var app = express();
var http = require('http').Server(app);

//Mongo dependency & url
const MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/mydb';

//Dependencies for personality insights
var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();
var PersonalityInsightsV2 = require('watson-developer-cloud/personality-insights/v2');

http.listen(appEnv.port, appEnv.bind);


//Personality insigts api credentials
var personality_insights = new PersonalityInsightsV2({
    username: '146b59de-39c1-45ab-9d19-2b6dcd199cd7',
    password: 'akCmGK1Uy6Mk'
});



var client = mqtt.connect(MQTT_ADDR); //Create a new connection (use the MQTT adress)
var numToGo = 0; //Initialise a number variable to 0

function wordCount(text) { // Function takes string, splits on the empty spaces (stripping out extra spaces) and returns length of resulting array = total words
    return text.split(' ').filter((n) => { return n != ''}).length;
}

function timeStamp() {
    var date = new Date().toLocaleDateString();
    var time = new Date().toLocaleTimeString();
    var timeStamp = date + " " + time;
    return timeStamp;
}

//MQTT
client.on('connect', function () { //connect the MQTT client
    client.subscribe(MQTT_TOPIC, {
        qos: 2
    }); //Subscribe to the topic
    //Might want to do a different topic for each aspect e.g. personalityInsight, Tone analysis, sentiment etc.
});

client.on('message', function (MQTT_TOPIC, message) {
    console.log(message.toString());
    var inputVar = message.toString();

    var numWords = wordCount(inputVar); // Get number of words from wordCount function

if (numWords > 100) { // If word count exceeds minimum required for personality insights then run
    personality_insights.profile({text: inputVar, language: 'en'}, (err, response) => {
        if (err)
            console.log('error:', err);
        else
            //console.log(JSON.stringify(response, null, 2)); raw json response
            var profile = response;
            var big5 = profile.tree.children[0].children[0].children;
            var needs = profile.tree.children[1].children[0].children;
            var values = profile.tree.children[2].children[0].children;

            //
            var test = [];
                            
            //Get big 5 peronality traits
            for (i = 0; i < big5.length; i++) {
                var name = big5[i].name;
                var percentage = Math.round(big5[i].percentage * 100);
                console.log(name);
                console.log(percentage);
                test[i] = {[name]: percentage} //Need to remove spaces to avoid 'emotional range' becoming string
                
            }
            console.log(test);

            MongoClient.connect(url, (err, db) => {
                if (err) throw err;
                
                var dbo = db.db('DAT602');
                var profile = {
                    date: timeStamp(),
                    Openness: test[0].Openness,
                    Conscientiousness: test[1].Conscientiousness,
                    Extraversion: test[2].Extraversion,
                    Agreeableness: test[3].Agreeableness
                };
                
                dbo.collection("personality").insertOne(profile, (err, res) => {
                    if (err) throw err;
                    console.log('1 Document inserted')
                    db.close;
                });   
            });
            
            /*
            //Get needs
            for (i = 0; i < needs.length; i++) {
                var name = needs[i].name;
                var percentage = Math.round(needs[i].percentage * 100);
                console.log(name);
                console.log(percentage);
            }

            //values
            for (i = 0; i < values.length; i++) {
                var name = values[i].name;
                var percentage = Math.round(values[i].percentage * 100);
                console.log(name);
                console.log(percentage);
            }*/
            
            });
        } else console.log("Need at least 100 words to run personality insights");
});

/*
client.on('message', function (MQTT_TOPIC, message) {
    console.log(message.toString());
    var inputVar = message.toString();

    personality_insights.profile({
            text: inputVar,
            language: 'en'
        },
        function (err, response) {
            if (err)
                console.log('error:', err);
            else
                console.log(JSON.stringify(response, null, 2));
                var profile = response;
                console.log(profile.tree.children[1].children[0].name);
                console.log(profile.tree.children[1].children[0].percentage);
        });
}); // commented out to test json AND FOR REFERENCE






// Local testing: still uses api calls - dont abuse 
/*
var inputVar = "Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made    me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick Food made me feel sick"    ;
// remove above variable and move the below code into on message mqqt block above

var numWords = wordCount(inputVar); // Get number of words from wordCount function

if (numWords > 100) { // If word count exceeds minimum required for personality insights then run
    personality_insights.profile({text: inputVar, language: 'en'}, (err, response) => {
        if (err)
            console.log('error:', err);
        else
            //console.log(JSON.stringify(response, null, 2)); raw json response
            var profile = response;
            var big5 = profile.tree.children[0].children[0].children;
            var needs = profile.tree.children[1].children[0].children;
            var values = profile.tree.children[2].children[0].children;

            //
            var test = [];
                            
            //Get big 5 peronality traits
            for (i = 0; i < big5.length; i++) {
                var name = big5[i].name;
                var percentage = Math.round(big5[i].percentage * 100);
                console.log(name);
                console.log(percentage);
                test[i] = {[name]: percentage} //Need to remove spaces to avoid 'emotional range' becoming string
                //test.push({
                //    [name]: percentage
                //});
            }
            console.log(test);

            MongoClient.connect(url, (err, db) => {
                if (err) throw err;
                
                var dbo = db.db('DAT602');
                var profile = {
                    date: timeStamp(),
                    Openness: test[0].Openness,
                    Conscientiousness: test[1].Conscientiousness,
                    Extraversion: test[2].Extraversion,
                    Agreeableness: test[3].Agreeableness
                };
                
                dbo.collection("personality").insertOne(profile, (err, res) => {
                    if (err) throw err;
                    console.log('1 Document inserted')
                    db.close;
                });   
            });
            
            /*
            //Get needs
            for (i = 0; i < needs.length; i++) {
                var name = needs[i].name;
                var percentage = Math.round(needs[i].percentage * 100);
                console.log(name);
                console.log(percentage);
            }

            //values
            for (i = 0; i < values.length; i++) {
                var name = values[i].name;
                var percentage = Math.round(values[i].percentage * 100);
                console.log(name);
                console.log(percentage);
            }*/
            /*
    });
} else console.log("Need at least 100 words to run personality insights");
    */
//Use the library MQTT (this exists in the node_modules folder)
var mqtt = require('mqtt')
var MQTT_TOPIC = "testtopic"; //MQTT topis is test
var MQTT_ADDR = "mqtt://broker.i-dat.org:80"; //Use the broker address here
var MQTT_PORT = 80; //And broker's port

var express = require('express');
var app = express();
var http = require('http').Server(app);
var cfenv = require("cfenv");

var appEnv = cfenv.getAppEnv();

http.listen(appEnv.port, appEnv.bind);

var PersonalityInsightsV2 = require('watson-developer-cloud/personality-insights/v2');

var personality_insights = new PersonalityInsightsV2({
    username: '146b59de-39c1-45ab-9d19-2b6dcd199cd7',
    password: 'akCmGK1Uy6Mk'
});



var client = mqtt.connect(MQTT_ADDR); //Create a new connection (use the MQTT adress)
var numToGo = 0; //Initialise a number variable to 0

//MQTT
client.on('connect', function () { //connect the MQTT client
    client.subscribe(MQTT_TOPIC, {
        qos: 2
    }); //Subscribe to the topic


});

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
        });
});
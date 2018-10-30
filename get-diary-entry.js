//MQTT Dependencies
var mqtt = require('mqtt')
var MQTT_TOPIC = "diaryentry"; //MQTT topic is test
var MQTT_ADDR = "mqtt://broker.i-dat.org:80"; //Use the broker address here
var MQTT_PORT = 80; //And broker's port

//dependencies for general nodejs server routing etc...
var express = require('express');
var app = express();
var http = require('http').Server(app);

var personalityInsight = require('./personality-insight.js');

var client = mqtt.connect(MQTT_ADDR); //Create a new connection (use the MQTT adress)

client.on('connect', function () { //connect the MQTT client
    client.subscribe(MQTT_TOPIC, {
        qos: 2
    }); //Subscribe to the topic
});

client.on('message', function (MQTT_TOPIC, message) {
    console.log(message.toString());
    personalityInsight.AnalysePersonality(message.toString());
});

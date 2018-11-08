//MQTT Dependencies
const mqtt = require('mqtt')
const MQTT_TOPIC = "diaryentry"; //MQTT topic 
//const MQTT_ADDR = "mqtt://broker.i-dat.org:80"; //Use the broker address here
//const MQTT_PORT = 80; //And broker's port
const WEB_PORT = 4000; //port for webserver to run on
var credentials = {port: 17816, username: "fowwpooq", password: "U-cF38BXV7A0"}; //credentials for cloudMQTT
const client = mqtt.connect('mqtt://m20.cloudmqtt.com', credentials);


//dependencies for general nodejs server routing etc...
const express = require('express');
const app = express();
const http = require('http').Server(app);

const mongoDB = require('./push-mongo-DB.js'); //enable access to pushtomongo function
const personalityInsight = require('./personality-insight.js'); //access to personality insight analysis
const toneAnalysis = require('./tone-analysis.js'); //access to tone analysis

//const client = mqtt.connect(MQTT_ADDR); //Create a new connection (use the MQTT adress)

client.on('connect', () => { //connect the MQTT client
    client.subscribe(MQTT_TOPIC, {
        qos: 2
    }); //Subscribe to the topic
});

client.on('message', (MQTT_TOPIC, message) => {

    var currentTime = timeStamp(); //get current time in a readable format.

    var entry = {}; //create object to hold diary entry.
    entry.entry = message.toString(); //store diary entry with entry key value pair.
    entry.timestamp = currentTime; //add timestamp to diary entry.
    mongoDB.PushtoMongo("DiaryEntries", entry); //Store diary entry in DB.
    toneAnalysis.AnalyseTone(message.toString(), currentTime); //send diary entry recieved to tone-analysis.js to analyse
    personalityInsight.AnalysePersonality(message.toString(), currentTime); //send diary entry recieved to personality-insight.js to analyse
});


function timeStamp() {
    var date = new Date().toLocaleDateString();
    var time = new Date().toLocaleTimeString();
    var timeStamp = date + " " + time;
    return timeStamp;
}



//Front End
const getMongoD = require("./getMongoD");
const hbs = require('express-handlebars'); // require handlebars
app.engine('hbs', hbs({
    helpers: {
        equals: (a, b, options) => {
            return a === b ? options.fn(this) : options.inverse(this);
        },
        toLowerCase: (str) => {
            return str.toLowerCase();
        },
    },
    extname: 'hbs',
    defaultLayout: 'layout.hbs',
    layoutsDir: __dirname + '/views/layout/'
})); //register engine and helpers

app.set('view engine', 'hbs'); // setting view engine to handlebars
const path = require('path');
app.use(express.static(path.join(__dirname, '/public')));


//var lastEntry = getMongoD.getLastEntry('dat602',"Personality");
//Set up routes for front end
app.listen(WEB_PORT, () => {
    console.log(`App Listening on Port: ${WEB_PORT}`); 
 });

app.get('/', (req, res, next) => {
    res.render('index', { title: 'Home', condition: false});
});

app.get('/profile', (req, res) => {
    //refering to the function in getMongoD.js - use promise to retrive recent data only when promise is fullfilled
    //Only when promise is fulfulled will the page render happen. MIGHT NEED TO TEST WHAT HAPPENS IF NO DATA EXISTS?
    getMongoD.getLastEntry('dat602', 'Personality').then((recentData) => {
        res.render('profile', { title: 'Profile', condition: false, recentData});
    });
});

app.get('/history', (req, res) => {
    res.render('history', { title: 'History', condition: false});
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About', condition: false});
});

app.get('*', (req, res) => {
    res.render('404', { title: '404 Page not found!', condition: false});
});
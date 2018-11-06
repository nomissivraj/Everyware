//MQTT Dependencies
const mqtt = require('mqtt')
const MQTT_TOPIC = "diaryentry"; //MQTT topic is test
//const MQTT_ADDR = "mqtt://broker.i-dat.org:80"; //Use the broker address here
//const MQTT_PORT = 80; //And broker's port
const WEB_PORT = 4000;
var credentials = {port: 17816, username: "fowwpooq", password: "U-cF38BXV7A0"};
const client = mqtt.connect('mqtt://m20.cloudmqtt.com', credentials);


//dependencies for general nodejs server routing etc...
const express = require('express');
const app = express();
const http = require('http').Server(app);

const personalityInsight = require('./personality-insight.js');

//const client = mqtt.connect(MQTT_ADDR); //Create a new connection (use the MQTT adress)

client.on('connect', () => { //connect the MQTT client
    client.subscribe(MQTT_TOPIC, {
        qos: 2
    }); //Subscribe to the topic
});

client.on('message', (MQTT_TOPIC, message) => {
    personalityInsight.AnalysePersonality(message.toString()); //send json object recieved to personality-insight.js to analysis
});

//Front End
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
})); //register engine
app.set('view engine', 'hbs'); // setting view engine to handlebars
const path = require('path');
app.use(express.static(path.join(__dirname, '/public')));

//Set up routes for front end
app.listen(WEB_PORT, () => {
    console.log(`App Listening on Port: ${WEB_PORT}`); 
 });

app.get('/', (req, res, next) => {
    res.render('index', { title: 'Home', condition: false});
});

app.get('/profile', (req, res) => {
    res.render('profile', { title: 'Profile', condition: false});
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
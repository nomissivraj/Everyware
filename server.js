const WEB_PORT = 4000; //port for webserver to run on
//dependencies for general nodejs server routing etc...
const express = require('express');
const app = express();
const http = require('http').Server(app);

const mongoDB = require('./push-mongo-DB.js'); //enable access to pushtomongo function
const personalityInsight = require('./personality-insight.js'); //access to personality insight analysis
const toneAnalysis = require('./tone-analysis.js'); //access to tone analysis

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
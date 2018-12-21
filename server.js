const WEB_PORT = 4000; //port for webserver to run on
//dependencies for general nodejs server routing etc...
const express = require('express');
const app = express();
const getMongoD = require("./getMongoD"); // Serverside database calls for profile and history
const hbs = require('express-handlebars'); // require handlebars

// Seting up handlebars template engine and some defining some helper functions for this
app.engine('hbs', hbs({
    helpers: {
        equals: (a, b, options) => {
            return a === b ? options.fn(this) : options.inverse(this);// Helper function to check for equality between two parameters
            //options = data contained in #equals block which will be returned/displayed if equality acheieved else will not be displayed
        },
        toLowerCase: (str) => {
            return str.toLowerCase();
            //simple function to return lowercase (using to set css classes based on variables/names that my be camel cased or capitalised)
        },
    },
    extname: 'hbs',
    defaultLayout: 'layout.hbs',
    layoutsDir: __dirname + '/views/layout/'
})); //register engine and helpers

//Front End
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
    getMongoD.getEntries('dat602', 'Personality', 1).then((recentData) => {
        recentData = recentData[0];//Since only one item and can't be looped need to select the first (only) object 
        res.render('profile', { title: 'Profile', condition: false, recentData});
    });
});

app.get('/history', (req, res) => {
    getMongoD.getEntries('dat602', 'Personality', 31).then((recentData) => {
        res.render('history', { title: 'History', condition: false, recentData});
    });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About', condition: false});
});

app.get('*', (req, res) => {
    res.render('404', { title: '404 Page not found!', condition: false});
});
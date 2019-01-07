const WEB_PORT = 4000; //port for webserver to run on
//dependencies for general nodejs server routing etc...
const express = require('express');
const app = express();
const getMongoD = require("./getMongoD"); // Serverside database calls for profile and history
const pushMongo = require("./pushMongo");
const resetMongo = require("./resetMongo");
const hbs = require('express-handlebars'); // require handlebars
const bodyParser = require('body-parser');
const funcs = require('./funcs'); //require custom miscellaneous functions

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

app.set('view engine', 'hbs'); // setting view engine to handlebars
const path = require('path');
app.use(express.static(path.join(__dirname, '/public'))); //Setting the public directory (for CSS/JS-Scrips/images etc.)
app.use(bodyParser.urlencoded({extended: true}));//using body parser to parse form data from post requests

//Set whhich port to listen for and run the app through
app.listen(WEB_PORT, () => {
    console.log(`App Listening on Port: ${WEB_PORT}`); 
 });
//Set up routes for front end

//index route
app.get('/', (req, res, next) => {
    res.render('index', { title: 'Home', condition: false});
});

//Profile page route to display profile info and recent diary analysis results
app.get('/profile', (req, res) => {
    //Get all entries using promises - save into variables to be used in Promise.all
    var personality = getMongoD.getEntries('dat602', 'Personality', 1);
    var diaryEntry = getMongoD.getEntries('dat602', 'DiaryEntries', 1);
    var profile = getMongoD.getEntries('dat602', 'Profile', 1);
    var tone = getMongoD.getEntries('dat602', 'Tone', 1);
    //Promise.all to avoid messy Promise chaining - once all promises are fulfilled all entries are accessible via a returned array 'collections'
    Promise.all([personality, diaryEntry, profile, tone]).then((collections) => {
        //userAge is empty by default 
        var userAge = "";
        if (collections[2][0]) { //If profile exists parse date of birth into age in years
            userAge = funcs.parseAge(collections[2][0].age)
        }
        var data = { //Build data object of all collections so all can be easily accessed client-side using Handlebars and dot notation
            "personality": collections[0],
            "diaryEntry": collections[1],
            "profile": collections[2],
            "tone": collections[3],
            "userAge": userAge
        }
        //pass data object into route for Handlebars access
        res.render('profile', {title: 'Profile', data, condition: false})
    });
});

//Rout for history page
app.get('/history', (req, res) => {
    //Get all entries using promises - save into variables to be used in Promise.all
    var personality = getMongoD.getEntries('dat602', 'Personality', 31);
    var diaryEntries = getMongoD.getEntries('dat602', 'DiaryEntries', 31);
    var tone = getMongoD.getEntries('dat602', 'Tone', 31);
    //Promise.all to avoid messy Promise chaining - once all promises are fulfilled all entries are accessible via a returned array 'collections'
    Promise.all([personality, diaryEntries, tone]).then((collections) => {           
        data = funcs.mergeCollections(collections);//merge collections into one useable array of objects
        res.render('history', { title: 'History', condition: false, data});
    });
});

//Route for about page
app.get('/about', (req, res) => {
    res.render('about', { title: 'About', condition: false});
});

//Route for settings page
app.get('/settings', (req, res) => {
    //Single promise for profile data - this is to pre-fill profile edit form and validate reset form
    getMongoD.getEntries('dat602', 'Profile', 1).then((data) => {
        data = data[0];
        res.render('settings', { title: 'Settings', data, condition: false});
    });
});
//Post route for parsing profile info form to update profile info on database
app.post('/profile-info', (req, res) => {
    //get date of birth entry data (they're seperate on form) and build a string in the format yyyymmdd
    var month = req.body.month;
    var day = req.body.day;
    var year = req.body.year;
    var dob = year+month+day;
    //build a profle object using the above dob string and the other inputs from the form
    var profileObj = {
        "name" : req.body.fullname,
        "age" :  dob,
        "gender" : req.body.gender,
        "location" : req.body.location,
        "hobbies" : req.body.hobbies
    }
    //push this data to the database to be updated - then redirec to the profile page
    pushMongo.updateProfile('dat602', 'Profile', profileObj).then((data) => {
        res.redirect('/profile')  
    });
      
});

//Post route for resetting account
app.post('/reset-account', (req, res) => {
    //run collection drop function to remove all data associated with user - then redirect back to home page
    resetMongo.dropCollections('dat602').then((data) => {
        res.redirect('/');
    });
});

//Route that catches anything that isn't a defined route and displays a 404 page not found message
app.get('*', (req, res) => {
    res.render('404', { title: '404 Page not found!', condition: false});
});

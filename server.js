const WEB_PORT = 4000; //port for webserver to run on
//dependencies for general nodejs server routing etc...
const express = require('express');
const app = express();
const getMongoD = require("./getMongoD"); // Serverside database calls for profile and history
const pushMongo = require("./pushMongo");
const resetMongo = require("./resetMongo");
const hbs = require('express-handlebars'); // require handlebars
const bodyParser = require('body-parser');
const funcs = require('./funcs')

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
app.use(bodyParser.urlencoded({extended: true}));

//Set up routes for front end
app.listen(WEB_PORT, () => {
    console.log(`App Listening on Port: ${WEB_PORT}`); 
 });

app.get('/', (req, res, next) => {
    res.render('index', { title: 'Home', condition: false});
});

app.get('/profile', (req, res) => {
    //refering to the function in getMongoD.js - use promise to retrive recent data only when promise is fullfilled
    var personality = getMongoD.getEntries('dat602', 'Personality', 1);
    var diaryEntry = getMongoD.getEntries('dat602', 'DiaryEntries', 1);
    var profile = getMongoD.getEntries('dat602', 'Profile', 1);
    var tone = getMongoD.getEntries('dat602', 'Tone', 1);

    //Only when promise is fulfulled will the page render happen. MIGHT NEED TO TEST WHAT HAPPENS IF NO DATA EXISTS?
    Promise.all([personality, diaryEntry, profile, tone]).then((collections) => {
        var data = {
            "personality": collections[0],
            "diaryEntry": collections[1],
            "profile": collections[2],
            "tone": collections[3]
        }
        res.render('profile', {title: 'Profile', data, condition: false})
    });
});

app.get('/history', (req, res) => {
    var personality = getMongoD.getEntries('dat602', 'Personality', 31);
    var diaryEntries = getMongoD.getEntries('dat602', 'DiaryEntries', 31);
    var tone = getMongoD.getEntries('dat602', 'Tone', 31);
    Promise.all([personality, diaryEntries, tone]).then((collections) => {           
        data = funcs.mergeCollections(collections);
        res.render('history', { title: 'History', condition: false, data});
    });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About', condition: false});
});

app.get('/settings', (req, res) => {
    getMongoD.getEntries('dat602', 'Profile', 1).then((data) => {
        data = data[0];
        res.render('settings', { title: 'Settings', data, condition: false});
    });
});

app.post('/profile-info', (req, res) => {
    var month = req.body.month;
    var day = req.body.day;
    var year = req.body.year;
    var dob = year+month+day;

    var profileObj = {
        "name" : req.body.fullname,
        "age" :  funcs.parseAge(dob),
        "gender" : req.body.gender,
        "location" : req.body.location,
        "hobbies" : req.body.hobbies
    }
    pushMongo.updateProfile('dat602', 'Profile', profileObj).then((data) => {
        res.redirect('/profile')  
    });
      
});

app.post('/reset-account', (req, res) => {
    resetMongo.dropCollections('dat602').then((data) => {
        console.log(data)
        console.log("RESET ACCOUNT");
        res.redirect('profile');
    });
});

app.get('*', (req, res) => {
    res.render('404', { title: '404 Page not found!', condition: false});
});

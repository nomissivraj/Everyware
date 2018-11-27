const express = require("express");
const app = express();
const SerialPort = require("serialport");
const port = 3000;
const opn = require('opn');
const server = require('http').Server(app);
const io = require('socket.io')(server);
//const Sys = require('util');
//const exec = require('child_process').exec;
const { spawn } = require('child_process');
var child;//child process variable
//const microphone = require('./mic-rec.js');
var micState; //Variable to set state of microphone for recording funcitons
const serial = new SerialPort('/dev/ttyUSB0', {	baudRate: 9600});// Monitor pi usb serial port
var state;// Variable to hold diary state true = open | false = closed


//function requirements
const mongoDB = require('./push-mongo-DB.js'); //enable access to pushtomongo function
const personalityInsight = require('./personality-insight.js'); //access to personality insight analysis
const toneAnalysis = require('./tone-analysis.js'); //access to tone analysis


//Serial Monitoring of sensor to check if diary is open/active or not
//Puts port in flowing mode
serial.on('data', (data) => {
    //console.log('Data:', parseInt(data));
    if (parseInt(data) > 50) {
        state = true;
    } else {
        state = false;
    }
});

//Sockets (server-side/client-side communication)
server.listen(5000); // Port for socket to listen on

io.on("connection", (socket) => {
	setInterval(() => {
		socket.emit("bookOpen", state);
	}, 1000);
    //Send book status to client every second - where it will be checked and page changed accordingly.
    socket.on('startRecord', (data) => {
        micState = data;
	handleRecording();
	console.log("state: " + micState);
    });

    socket.on('stopRecord', (data) => {
	micState = data;
	handleRecording();
	console.log("state: " + micState);
    });

    socket.on('saveEntry', (data) => {
        console.log("this is when it would save the file and do speech to text");
    });
});


function startRecording(dir,file) {
  console.log("recording");

	child = spawn('arecord', ['-r 16000', '-c 1', '-fS16_LE', dir+file]);

	child.stdout.on('data', (data) => {
	  console.log(`stdout: ${data}`);
	});

	child.stderr.on('data', (data) => {
	  console.log(`stderr: ${data}`);
	});

	child.on('close', (code) => {
	  console.log(`child process exited with code ${code}`);
	});
}

function stopRecording() {
	console.log('killing');
	child.kill();
  var tempMessage = "To start off, I think I completely failed my geometry quiz, which I know I should’ve studied more for...my dad’s not gonna be happy about that. :( Then, we had a pop quiz in history on the reading homework from last night, and I completely forgot most of what I read, which made me even more upset because I actually did the reading! But what really made me mad was the note that Sarah slipped into my locker during passing period. She said she was sad that I’ve been hanging out with Jane more lately and thinks that I don’t want to be her friend anymore. I can’t believe she thinks that, especially after talking with her on the phone for hours and hours last month while she was going through her breakup with Nick! Just because I’ve been hanging out with Jane a little more than usual doesn’t mean I’m not her friend anymore. She completely blew me off at lunch, and when I told Jane, she thought that Sarah was being a";
  console.log(tempMessage);
  beginAnalysis(tempMessage);
}



function beginAnalysis(message){

    var currentTime = timeStamp(); //get current time in a readable format.

    var entry = {}; //create object to hold diary entry.
    entry.entry = message.toString(); //store diary entry with entry key value pair.
    entry.timestamp = currentTime; //add timestamp to diary entry.
    mongoDB.PushtoMongo("DiaryEntries", entry); //Store diary entry in DB.
    toneAnalysis.AnalyseTone(message.toString(), currentTime); //send diary entry recieved to tone-analysis.js to analyse
    personalityInsight.AnalysePersonality(message.toString(), currentTime); //send diary entry recieved to personality-insight.js to analyse

}

function timeStamp() {
    var date = new Date().toLocaleDateString();
    var time = new Date().toLocaleTimeString();
    var timeStamp = date + " " + time;
    return timeStamp;
}


handleRecording();

function handleRecording() {
	//Switch statement to handle recording based on state of book open/closed/stopped etc.
	switch(micState) {
	    case "record":
	      //microphone.startRecord("/home/pi/", "test1.wav");
		startRecording("/home/pi/", "test1.wav");
	      break;
	    case "stopped":
		console.log('stopping the recording?');
	      //microphone.stopRecord();
		stopRecording();
	      break;
	    default:
	      console.log('idle');
	      break;
	  }
}


//Font end web routes etc. :

app.use(express.static('www'));

app.get('/', (req, res) =>{
    res.sendFile(__dirname + "/www/visualisation.html");
});

app.get('/input', (req, res) =>{
    res.sendFile(__dirname + "/www/input.html");
});

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});

//opn('http://localhost:3000');

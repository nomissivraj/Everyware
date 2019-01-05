// Dependencies
const express = require("express");
const app = express();
const SerialPort = require("serialport");
const port = 3000;
const fs = require('fs');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
//const opn = require('opn');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { spawn } = require('child_process');
const serial = new SerialPort('COM3', {	baudRate: 9600})// Monitor pi usb serial port

// Exported functions
const mongoDB = require('./push-mongo-DB.js'); //enable access to pushtomongo function
const personalityInsight = require('./personality-insight.js'); //access to personality insight analysis
const toneAnalysis = require('./tone-analysis.js'); //access to tone analysis

// Program Variables 
var micState; //Variable to set state of microphone for recording funcitons
var bookState; // Variable to hold diary state true = open | false = closed
var dir = "./audio/"; //Directory to store diary audio entries
var file = "entry.wav"; //Filename of diary audio entry



//Serial Monitoring of sensor to check if diary is open/active or not
//Puts port in flowing mode
//console.log("serial: ",serial);
serial.on('data', (data) => {
	if (parseInt(data) > 0 ) {
		//console.log('Data:', parseInt(data));
		if (parseInt(data) > 30) {
			bookState = true;
		} else {
			bookState = false;
		}
	} 
});

//Sockets (server-side/client-side communication)
server.listen(5000); // Port for socket to listen on
var sent = 0;
io.on("connection", (socket) => {
    // EMIT TO CLIENT
    setInterval(() => {
		socket.emit("bookOpen", bookState);
		if (transcript) {
			console.log("sending transcript:", transcript)
			socket.emit("transcript", transcript);	
			transcript = null;
			sent = 0;
		}
    }, 1000);
    //Send book status to client every second - where it will be checked and page changed accordingly.        
    
    // BACK FORM CLIENT: 
    socket.on('startRecord', (data) => {
        micState = data;
		console.log("micState from client: " + micState);
		handleRecording();
	
    });

    socket.on('stopRecord', (data) => {
		micState = data;
		sent = 0;
		console.log("micState from client: " + micState);
		handleRecording();
    });

    socket.on('saveEntry', (data) => {
		console.log("saving text: ", data);
		beginAnalysis(data);
    });
    
    socket.on('newFlower', (data) => {

		mongoDB.PushtoMongoReplaceNewFlower("ActiveFlower", data);
    });
    
    socket.on('fakeEntry', (data) => {
        beginAnalysis(data);
    });
    
    socket.on('adjustFlower', (data) => {
        mongoDB.PushtoMongoGrowFlower(data);
    });


});
//END SOCKETS


// MICROPHONE RECORDING FUNCTIONS
var child;
function startRecording(dir,file) {
  console.log("recording");

	child = spawn('sox', ['-t', 'waveaudio', '-d', dir+file]);
		child.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});

	child.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
	});

	child.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
	});
	 
	/* Following code is for Raspberry Pi/Linux
	child = spawn('arecord', ['-r 16000', '-c 1', '-fS16_LE', dir+file]);

	child.stdout.on('data', (data) => {
	  console.log(`stdout: ${data}`);
	});

	child.stderr.on('data', (data) => {
	  console.log(`stderr: ${data}`);
	});

	child.on('close', (code) => {
	  console.log(`child process exited with code ${code}`);
	});*/
}

function stopRecording() {
    /*if (child)*/ child.kill();
    toText(dir, file);
    micState = null;
  //var tempMessage = "To start off, I think I completely failed my geometry quiz, which I know I should’ve studied more for...my dad’s not gonna be happy about that. :( Then, we had a pop quiz in history on the reading homework from last night, and I completely forgot most of what I read, which made me even more upset because I actually did the reading! But what really made me mad was the note that Sarah slipped into my locker during passing period. She said she was sad that I’ve been hanging out with Jane more lately and thinks that I don’t want to be her friend anymore. I can’t believe she thinks that, especially after talking with her on the phone for hours and hours last month while she was going through her breakup with Nick! Just because I’ve been hanging out with Jane a little more than usual doesn’t mean I’m not her friend anymore. She completely blew me off at lunch, and when I told Jane, she thought that Sarah was being a";

  //beginAnalysis(tempMessage);
}

// END MICROPHONE RECORDING FUNCTIONS



// SPEECH TO TEXT
var speechToText = new SpeechToTextV1({
    username: '4bab5a29-863d-4d9d-8838-3e2dc3ccdcf1',
    password: 'vnMnoG300QVL',
    url: 'https://stream.watsonplatform.net/speech-to-text/api'
  });


var params = {
    objectMode: false,
    content_type: 'audio/wav',
	model: 'en-GB_BroadbandModel',
	continuous: true,
	interim_results: false
};

var transcript;
function toText(dir,file) {
	// Create the stream.
	var recognizeStream = speechToText.recognizeUsingWebSocket(params);

	// Pipe in the audio.
	fs.createReadStream(dir+file).pipe(recognizeStream);

	//print to console
	recognizeStream.setEncoding('utf8');


	// Listen for events.
	recognizeStream.on('data', function(event) { onEvent('Data:', event); });
	recognizeStream.on('error', function(event) { onEvent('Error:', event); });
	recognizeStream.on('close', function(event) { onEvent('Close:', event); });
	var text = [];
	// Display events on the console	
	function onEvent(name, event) {
		console.log(name);
		if (name === "Data:") {
			text.push(event.trim());
			console.log("EVENT: ", event);
		} else if (name === "Close:") {
			var result = text.join(', ');
			transcript = result;
		}
	};
}


// END SPEECH TO TEXT

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
		startRecording(dir, file);
		console.log('current state:', micState);
	      break;
	    case "stopped":
		console.log('currrent state:', micState);
		stopRecording();
	      break;
	    default:
	      console.log('idle');
	      console.log('currrent state:', micState);
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

app.get('/test', (req, res) =>{
    res.sendFile(__dirname + "/www/test.html");
});


app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});

//opn('http://localhost:3000');

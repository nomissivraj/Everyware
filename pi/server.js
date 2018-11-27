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

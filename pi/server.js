const express = require("express");
const app = express();
const SerialPort = require("serialport");
const port = 3000;
const opn = require('opn');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Sys = require('util');
const exec = require('child_process').exec;
var child;//child process variable
const microphone = require('./mic-rec.js');
var micState; //Variable to set state of microphone for recording funcitons
const serial = new SerialPort('/dev/ttyUSB0', {	baudRate: 9600});// Monitor pi usb serial port
var state;// Variable to hold diary state true = open | false = closed

//Serial Monitoring of sensor to check if diary is open/active or not
//Puts port in flowing mode
serial.on('data', (data) => {
    //console.log('Data:', parseInt(data));
    if (parseInt(data) > 200) {
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
});

//Switch statement to handle recording based on state of book open/closed/stopped etc.
switch(micState) {
    case "record":
      microphone.startRecord("/home/pi/", "test1.wav"); 
      break;
    case "stop":
      microphone.stopRecord();
      break;
    default: 
      console.log('idle');
      break;
  }


//Font end web routes etc. :

app.use(express.static('www'));

app.get('/', (req, res) =>{
    res.sendFile(__dirname + "/www/visualisation.html");
    //state == true ? res.redirect('/input') : res.redirect('/');
});

app.get('/input', (req, res) =>{
    res.sendFile(__dirname + "/www/input.html");
});

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});

//opn('http://localhost:3000');
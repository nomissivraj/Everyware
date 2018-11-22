const express = require("express");
const app = express();
const SerialPort = require("serialport");
const port = 3000;
const opn = require('opn');
const server = require('http').Server(app);
const io = require('socket.io')(server);
server.listen(5000);

io.on("connection", (socket) => {
	setInterval(() => {
		socket.emit("bookOpen", state);
	}, 1000);
    
});

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

opn('http://localhost:3000');
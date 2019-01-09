var exports = module.exports = {};
const exec = require('child_process').exec;
const speechText = require('./speech-text');
var child;

exports.startRecording = (dir, file) => {
    
    
    console.log("recording");
    //start recording
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
};

exports.stopRecording = () => {
    console.log("Stopped recording");
    if (child) child.kill();
    //send voice file off to be converted to text
    var text = speechText.toText('/home/pi/', 'test1.wav');
};

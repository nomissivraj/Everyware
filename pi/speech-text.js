var exports = module.exports = {};
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const fs = require('fs');

var speechToText = new SpeechToTextV1({
    username: '4bab5a29-863d-4d9d-8838-3e2dc3ccdcf1',
    password: 'vnMnoG300QVL',
    url: 'https://stream.watsonplatform.net/speech-to-text/api'
  });


var params = {
    objectMode: false,
    content_type: 'audio/wav',
    model: 'en-GB_BroadbandModel'
};

exports.toText = function(dir,file) {
	// Create the stream.
	var recognizeStream = speechToText.recognizeUsingWebSocket(params);

	// Pipe in the audio.
	fs.createReadStream(dir+file).pipe(recognizeStream);

	//print to console
	recognizeStream.setEncoding('utf8');


	// Listen for events.
	recognizeStream.on('data', function(event) { onEvent('Data:', event); });
	recognizeStream.on('error', function(event) { onEvent('Error:', event); });
	//recognizeStream.on('close', function(event) { onEvent('Close:', event); });

	// Display events on the console.
	var result;
	
	function onEvent(name, event) {
		console.log("EVENT: ", event);
		result = event;
	};
}



var exports = module.exports = {};

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var toneAnalyzer = new ToneAnalyzerV3({
    version: '2017-09-21',
    iam_apikey: 'HgnOripKAYQ2YseJqksLI5RzHY3BkogZdxZeh1SvNjjM',
    url: 'https://gateway-syd.watsonplatform.net/tone-analyzer/api'
  });



var mongoDB = require('./push-mongo-DB.js'); //enable access to pushtomongo function

exports.AnalyseTone = function(entry, timeStamp) { 
    var toneParams = { //create object to analyse tone
        tone_input: { 'text': entry }, //use diary entry
        content_type: 'application/json',
        sentences: 'false' //don't analyse individual sentences
      };
      
    toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
        if (error) {
          console.log(error);
        } else { 

            var filteredToneAnalysis = {}; //create object to hold filtered response
            for(var i = 0; i < toneAnalysis.document_tone.tones.length; i++) { //for each tone 
                var name = toneAnalysis.document_tone.tones[i].tone_id; //store tone id 
                var score = Math.round(toneAnalysis.document_tone.tones[i].score * 100); //and score
                filteredToneAnalysis[name] = score; //add tone id and score pair to filtered response
            } 
            
            filteredToneAnalysis.timestamp = timeStamp; //add timestamp to  filtered tone analysis
            mongoDB.PushtoMongo("Tone", filteredToneAnalysis); //pass the collection name and filteredProfile object to mongoDB.js to add to DB

        }
      });

}



var exports = module.exports = {};

var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

//create Watson personality insight API key
var personalityInsights = new PersonalityInsightsV3({
    version: '2017-10-13',
    username: '146b59de-39c1-45ab-9d19-2b6dcd199cd7',
    password: 'akCmGK1Uy6Mk',
    url: 'https://gateway.watsonplatform.net/personality-insights/api'
});

var mongoDB = require('./push-mongo-DB.js'); //enable access to pushtomongo function

exports.AnalysePersonality = function(entry, timeStamp) {
    var profileParams = {
        //get diary entry from passed value
        content: entry,
        'content_type': 'text/plain'
    };

    personalityInsights.profile(profileParams, function (error, profile) {
        if (error) {
            console.log(error); //throw error if personality insight doesn't work
        } else {
            var filteredProfile = {}; //create filteredProfile object to hold the parsed data.
            let flowerScore = 0; //to hold the flower growth modifier
            
            //for every item in the recieved JSON object with the id of personality
            for(var i = 0; i < profile.personality.length; i++){
                var name = profile.personality[i].trait_id; //store trait_id in name variable
                var score = Math.round(profile.personality[i].percentile * 100); //store rounded percentage value in score variable
                filteredProfile[name] = score; //add the key/value pair to the filtered profile object using the stored name and score
                let tempScore = parseInt((score / 12.5) - 2);
                flowerScore += tempScore;
            }

            filteredProfile.timestamp = timeStamp; //add timestamp to end of DB entry
            mongoDB.PushtoMongoGrowFlower(flowerScore); //grow the flower
            mongoDB.PushtoMongo("Personality", filteredProfile); //pass the collection name and filteredProfile object to mongoDB.js to add to DB
          
        }
    });

}



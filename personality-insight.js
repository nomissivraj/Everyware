var exports = module.exports = {};

var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

var personalityInsights = new PersonalityInsightsV3({
    version: '2017-10-13',
    username: '146b59de-39c1-45ab-9d19-2b6dcd199cd7',
    password: 'akCmGK1Uy6Mk',
    url: 'https://gateway.watsonplatform.net/personality-insights/api'
});

exports.AnalysePersonality = function(entry) {
    var profileParams = {
        //get diary entry
        content: entry,
        'content_type': 'text/plain'
    };

    personalityInsights.profile(profileParams, function (error, profile) {
        if (error) {
            console.log(error);
        } else {
            //console.log(JSON.stringify(profile, null, 2));
          
        }
    });

}



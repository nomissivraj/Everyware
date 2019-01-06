var exports = module.exports = {};

exports.parseAge = (dob) => { //recieve age in string format yyyymmdd
    if (!dob) return;
    //split DoB string up into year month and day variables. 
    var year = Number(dob.substr(0, 4));
    var month = Number(dob.substr(4, 2)) - 1;
    var day = Number(dob.substr(6, 2));
    //get current date
    var today = new Date();
    //store age based on current year minus the year of birth
    var age = today.getFullYear() - year;
    //if the current month is less than the value of the DoB month or the current month is equal to the DoB month as well as the day being less than DoB day will need to subtract one from age (age--)
    if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
        age--;
    }
    return age;
}

exports.mergeCollections = (collections) => {
    //Need to merge multiple collections so that one loop in the client-side can build from multiple data sources i.e. looping through each collection simultaneusly and displaying in one place wont work
    //Sollution is to merge each document from each collection into one accessible object
    var colLengths = [];
    var mergedCols = [];
    // for each collection in collections push the length of however many objects are in the current collection into colLenghts array
    for (let i = 0; i < collections.length; i++) {
        colLengths.push(collections[i].length);
    }
    // Find largest number in colLengths array, this tells me how many items we should process
    var maxColLength = Math.max.apply(null, colLengths);
    // For each collections objects extract the current collections document and store it in an object
    for (let i = 0; i < maxColLength; i++) {
        var obj = {
            "personality": collections[0][i],
            "diaryEntry": collections[1][i],
            "tone": collections[2][i]
        }
        // push the object of current merged collections documents to an array
        mergedCols.push(obj);
    }
    //return array of all objects of merged collections documents
    return mergedCols;
} 
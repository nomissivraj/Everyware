var exports = module.exports = {};

exports.parseAge = (dob) => {
    var year = Number(dob.substr(0, 4));
    var month = Number(dob.substr(4, 2)) - 1;
    var day = Number(dob.substr(6, 2));
    var today = new Date();
    var age = today.getFullYear() - year;
    if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
    age--;
    }
    return age;
}

exports.mergeCollections = (collections) => {
    var colLengths = [];
    var mergedCols = [];
    for (let i = 0; i < collections.length; i++) {
        colLengths.push(collections[i].length);
    }
    var maxColLength = Math.max.apply(null, colLengths);
    for (let i = 0; i < maxColLength; i++) {
        var obj = {
            "personality": collections[0][i],
            "diaryEntry": collections[1][i],
            "tone": collections[2][i]
        }
        mergedCols.push(obj);
    }
    return mergedCols;
} 
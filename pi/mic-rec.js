var exports = module.exports = {};

exports.startRecord = () => {
    console.log("recording");
    // executes command - parameters are error, standard output, standard error
    child = exec("arecord -r 16000 -c 1  -f S16_LE " + dir + file, (error, stdout, stderr) => {
        stderr ? console.log('stderr: ' + stderr) : null;
        error !== null ? console.log('exec error: ' + error) : null;
    });
};

exports.stopRecord = () => {
    function stopMic() {
        console.log("Stopped recording");
        child = exec("pkill arecord", (error, stdout, stderr) => {
            stderr ? console.log('stderr: ' + stderr) : null;
            error !== null ? console.log('exec error: ' + error) : null;
        });
    }
};
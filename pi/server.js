const express = require("express");
const app = express();

const port = 3000;

app.use(express.static('www'));

app.get('/', (req, res) =>{
    res.sendFile(__dirname + "/www/visualisation.html");
});
app.get('/input', (req, res) =>{
    res.sendFile(__dirname + "/www/input.html");
});
app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
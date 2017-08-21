// Read these comments first.
// Instructions for installing express here: https://expressjs.com/en/starter/installing.html
// cd into project directory
// run "npm init"
// mash enter until it's finished
// run "npm install express --save"

const express = require("express");

var host = "127.0.0.1";
var port = 8080;

var app = express();
app.use('/', express.static(__dirname + '/'));
app.listen(port, host);

console.log('Running server at http://localhost:' + port + '/');
/**************************
 * settings
**************************/
const express = require("express");
const http = require("http");
const bodyParser = require('body-parser')

const app = express();
const server = http.createServer(app);

const serverSettings = {
	host: "https://localhost",
	port: process.env.PORT || 8080,
}

app.use(bodyParser.json())

/**************************
 * server startup
**************************/

// scripts
var games = require('./games/index.js');
var groups = require('./groups/index.js');
var users = require('./users/index.js');

app.use("/games", games.router);
app.use("/groups", groups.router);
app.use("/users", users.router);

// Server Start
server.listen(serverSettings.port, function(){
	console.log("App listening at %s:%s", serverSettings.host, serverSettings.port);
});

// Load Databases
games.loadData();
groups.loadData();
users.loadData();

// Server Sutdown
process.on("SIGINT", onExit);

function onExit(){
	//SaveDatabase();
	console.log("Server shutdown");
	process.exit();
}

function SaveDatabase(){
	groups.saveData();
}
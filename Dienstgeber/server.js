/**************************
 * settings
**************************/
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const serverSettings = {
	host: "https://localhost",
	port: process.env.PORT || 8080,
}


/**************************
 * server startup
**************************/

// scripts
var games = require('./games/index.js');

app.use("/games", games.router);

server.listen(serverSettings.port, function(){
	console.log("App listening at %s:%s", serverSettings.host, serverSettings.port);
});

games.loadData();

process.on("SIGINT", onExit);

function onExit(){
	console.log("Server shutdown");
	process.exit();
}
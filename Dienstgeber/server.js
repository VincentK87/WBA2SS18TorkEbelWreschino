/**************************
 * settings
**************************/
const express = require("express");
const http = require("http");
const bodyParser = require('body-parser')
const async = require("async");

const app = express();
const server = http.createServer(app);

const serverSettings = {
	host: "https://localhost",
	port: process.env.PORT || 8080,
}
app.use(bodyParser.json())

/**************************
 * server Settings
**************************/

// load scripts
var games = require('./games/index.js');
var groups = require('./groups/index.js');
var users = require('./users/index.js');

app.use("/games", games.router);
app.use("/groups", groups.router);
app.use("/users", users.router);

// Load Databases
async.waterfall([

	function(callback) {
		groups.loadData(callback);
	},
	function (err, callback) {
		if(err != null){
			callback(err, false);
		}
		else {
			games.loadData(callback);
		}
	},
	function (err, callback){
		if(err != null){
			callback(err, false);
		}
		else {
			callback(null, true)
		}
	},
], function(err, success) {
	console.log("Database " + (success? "successfully loaded." : "failed loading. - " + err ));
	

// Server Start
	server.listen(serverSettings.port, function() {
		console.log("App listening at %s:%s", serverSettings.host, serverSettings.port);
	});
});


// Server Sutdown
process.on("SIGINT", onExit);

function onExit(){
	
	async.waterfall([
		function(callback){
			groups.saveData(callback);
		},
		function (err, callback) {
			if(err != null){
				callback(err, false);
			}
			else {
				games.saveData(callback);
			}
		},
		function (err, callback){
			if(err != null){
				callback(err, false);
			}
			else {
				callback(null, true);
			}
		},
	], function(err, success) {
		
		console.log("Database " + (success? "successfully saved." : "failed saving. - " + err ));
		
		console.log("Server Shutdown");
		process.exit();
	});
}
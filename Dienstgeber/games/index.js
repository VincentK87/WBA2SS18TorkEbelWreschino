const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");
const request = require('request');

const router = express.Router();

const db_path = "/games.json";
const allGamesJson = "/allGames.json";
const steamAPIurl = "https://api.steampowered.com/ISteamApps/GetAppList/v2/";

var allGames;

/**************************
 * REST API
**************************/

router.get('/', function(req, res){
	res.send(allGames.apps);
});


/**************************
 * Functions
**************************/
function updateDatabase(){
	request(steamAPIurl, function (error, response, body) {
		if (!error){
			allGames = JSON.parse(body).applist;
			allGames.checkDate = new Date();
			
			saveDatabase();
		}
	});
};

function loadDatabase(){
	fs.readFile(__dirname + allGamesJson, function(err, data){
		allGames = JSON.parse(data);
	});
};

function saveDatabase(){
	fs.writeFile(__dirname + allGamesJson, JSON.stringify(allGames)	, function(err){
		console.log("success saving file");
	});	
}


/**************************
 * export
**************************/

module.exports = {

	router: router,

	loadData : function () {
		loadDatabase();
	}

}
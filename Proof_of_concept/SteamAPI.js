const request = require('request');
const fs = require('fs');
const readline = require('readline');

const gamesDataFile = "/AllGames.json";
const urlGame = "http://store.steampowered.com/api/appdetails?appids=";
const url = "https://api.steampowered.com/ISteamApps/GetAppList/v2/";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var allGames;


//MAIN
loadFromFile();


//load all games from API
function loadFromAPI(){
	request(url, function (error, response, body) {
		if (!error){
			allGames = JSON.parse(body).applist.apps;
			getInput();
			
			fs.writeFile(__dirname + gamesDataFile, body, function(err){
				console.log("success saving file");
			});	
		}
	});
};

//load all games from File
function loadFromFile(){
	fs.readFile(__dirname + gamesDataFile, function(err, data){
		allGames = JSON.parse(data).applist.apps;
		getInput();
	});
};

//get info of spezific game
function getGameData(gameID){
	request(urlGame + gameID, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body)[gameID];
					
			if(data.success ){
				console.log(data.data);
			}
			else {
				console.error("Error : " + error);
			}
		}
	});
};

//get Games ID
function getGameID(name){
	
	var found = allGames.find(function(element) {
		if(element.name == name)
		return element;
	});
	
	return found;
}

function getInput(){
	
	console.log("get Game Info :");
	rl.on('line', (line) => {
		var gameID = getGameID(line);
		
		if (gameID === undefined) {
			console.log("game \""+line+"\" not found");
		}
		else {
			getGameData(gameID.appid);
		}
	});
}
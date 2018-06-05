// require modules
const request = require('request');
const fs = require('fs');
const readline = require('readline');

// path to save data
const gamesDataFile = "/AllGames.json";
// url for information of a spezific game
const urlGame = "http://store.steampowered.com/api/appdetails?appids=";
// url to all games in the steam database
const url = "https://api.steampowered.com/ISteamApps/GetAppList/v2/";

// rl to get input into console.
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// saves all games data
var allGames;

//start the script
loadFromFile();


//load all games from API
function loadFromAPI(){
	// gets all games from steam database
	request(url, function (error, response, body) {
		// if there is no error parse the string
		if (!error){
			allGames = JSON.parse(body).applist.apps;
			getInput();
			
			// save the file into json database
			fs.writeFile(__dirname + gamesDataFile, body, function(err){
				console.log("success saving file");
			});	
		}
	});
};

//load all games from File
function loadFromFile(){
	// if the file exist it may load the informatione from local file
	fs.readFile(__dirname + gamesDataFile, function(err, data){
		allGames = JSON.parse(data).applist.apps;
		getInput();
	});
};

//get info of spezific game
function getGameData(gameID){
	// request a specific game from steam api
	request(urlGame + gameID, function (error, response, body) {
		// if there was no error save the game info into var = data
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

// returns the id of a game
// param:name = the name of a game you want to know the id
// return: int = id of the game
function getGameID(name){
	// algorithm to get id of game in allGames
	var found = allGames.find(function(element) {
		if(element.name == name)
		return element;
	});
	
	return found;
}

// user is able to write the games name and gets the information of the game
function getInput(){
	
	console.log("get Game Info :");
	// line: the input of the user 
	rl.on('line', (line) => {
		// gets the id of a game by name
		var gameID = getGameID(line);
		
		// if the gameID doesnt exist = exit
		if (gameID === undefined) {
			console.log("game \""+line+"\" not found");
		}
		else {
			// else return info of game
			getGameData(gameID.appid);
		}
	});
}
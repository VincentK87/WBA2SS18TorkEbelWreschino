const igdb = require('igdb-api-node').default;

const client = igdb('c1670ab9380e5f235375e32351daff78'),
    log = response => {
        console.log(response.url, JSON.stringify(response.body, null, 2));
    };

const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");
const request = require('request');

const router = express.Router();

const db_path = "/igdb_games.json";
const gameDataJson = "/igdb_games.json";


var gameData;

/**************************
 * Object
**************************/

function Game() {
    // TO DO
}


/**************************
 * REST API
**************************/

/*
router.post('/', function(req, res) {
    var games = req.body;

    if(!checkIsValidForm(games)) {
        res.sendStatus(406);
    } else {
        var newGame = new gameData();
        allGames.push(newGame);

        res.send(newGame);
    }
});
*/

router.get('/', function(req, res){


    client.games({
        limit: 20, // Limit to 5 results
        offset: 0, // Index offset for results
        order: 'release_dates.date:desc',
        search: 'ff'
    }, [
        'id',
        'name',
        'url'
    ]).then(gameData => {
        res.status(200).json(gameData.body);
    }).catch(error => {
        res.status(401).send("Fehler: " + error);
    });
    
});


router.get('/test', function(req, res) {

    client.games({
        ids: [
            9999999999,
            00
        ]
    }, [
        'name']
    ).then(log);


});



/**************************
 * Functions
**************************/
function updateDatabase(){
	request(function (error, response, body) {
		if (!error){
			gameData = JSON.parse(body).applist;
			gameData.checkDate = new Date();
			
			saveDatabase();
		}
	});
};


/**************************
 * export
**************************/

module.exports = {

	router: router,

	loadData : function (callback) {
		fs.readFile(__dirname + gameDataJson, function(err, data){
			gameData = JSON.parse(data);
			callback(null, err);
		});
	},
	saveData : function (callback) {
		fs.writeFile(__dirname + gameDataJson, JSON.stringify(gameData), function(err){
			callback(null, err);
	});	

	}
}
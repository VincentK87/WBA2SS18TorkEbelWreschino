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
const gameDataJson = "/igdb_games.json";

var gameData;


/**************************
 * REST API
**************************/
// Get all games
router.get('/', function(req, res){


    client.games({
        limit: 50, // Limit to 20 results
        offset: 0, // Index offset for results
        order: 'release_dates.date:desc',
        search: 'ff'
    }, [
        'id',
        'name'
	]).then(function(gameData) {
		var Obj;
		gameData.body.forEach(function(element){
			element.href = serverSettings.host + "games/" + element.id
			delete element.id;
		});
		res.status(200).json(gameData.body);
	}).catch(error => {
        res.status(401).send("Fehler: " + error);
    });
    
});

// Get more information about one game
router.get('/:gameID', function(req, res) {

    client.games({
        ids: [
            req.params.gameID
        ]
    }, [
        'name',
		'cover',
		'release_dates.date',
		'rating'
		]
    ).then(function(data){
		if(data.body.length == 0){
			res.sendStatus(404);
		}
		else {
			res.send(data.body);
		}
	});
});

/**************************
 * export
**************************/

module.exports = {

	router: router
}
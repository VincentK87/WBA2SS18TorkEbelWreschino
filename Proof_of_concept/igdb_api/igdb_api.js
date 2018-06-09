// required modules

const igdb = require('igdb-api-node').default;

const client = igdb('c1670ab9380e5f235375e32351daff78'),
    log = response => {
        console.log(response.url, JSON.stringify(response.body, null, 2));
    };

const express = require("express");
// const bodyParser = require('body-parser');
const fs = require("fs");
const request = require('request');

const readline = require('readline'),
rl = readline.createInterface(process.stdin, process.stdout);

// readline interface with console input and output
//const i = readline.createInterface(process.stdin, process.stdout, null);
/*i.question("'ssuuup?", function(answer) {
    console.log("k thanks");

    // terminate program
    i.close();
    process.stdin.destroy();
}); */


//const router = express.Router();

// path to database
const json_path = "/games.json";

// save for game data
var gameData;


/**************************
 * Functions
**************************/

function getSomeGames() {
    client.games({
        fields: '*', // Return all fields
        limit: 5, // Limit to 5 results
        offset: 15 // Index offset for results
    }).then(response => {
        console.log(response);
    }).catch(error => {
        response.sendStatus(400);
    });
}

function getSomePlatforms() {

    /*
    Search for up to two PlayStation platforms and return their names
    */
    client.platforms({
        limit: 2,
        search: 'PlayStation'
    }, [
        'name'
    ]).then(log);
}

/*
Search for up to ten Final Fantasy (FF) games with release dates between 1rst Jan 1997 and
31 Dec 2005, sorted by release date in descending order.
*/
function getReleasedGames() {

    client.games({
        filters: {
            'release_dates.date-gt': '1997-01-01',
            'release_dates.date-lt': '2005-12-31'
        },
        limit: 10,
        offset: 0,
        order: 'release_dates.date:desc',
        search: 'ff'
    }, [
        'name',
        'release_dates.date',
        'rating',
        'hypes',
        'cover'
    ]).then(log);
}

/*
Search for two specific games by their IDs
*/
function getGamesById() {

    client.games({
        ids: [
            18472,
            18228
        ]
    }, [
        'name',
        'cover'
    ]).then(log);
}

/*
Search for companies with 'square enix' in their name. Return up to five
results sorted by name in descending order
*/
function getSomeCompanies() {

    client.companies({
        field: 'name',
        limit: 5,
        offset: 0,
        order: 'name:desc',
        search: 'square enix'
    }, [
        'name',
        'logo'
    ]).then(log);
}

// TO DO

/* function updateDatabase(){
	request(function (error, response, body) {
		if (!error){
			gameData = JSON.parse(body).applist;
			gameData.checkDate = new Date();
			
			saveDatabase();
		}
	});
};
*/

/**************************
 * Using Functions
**************************/

getReleasedGames();

/**************************
 * Readline
**************************/

function getInput() {

    console.log("What game would you like to know more about? ... ");

    //TO DO
}


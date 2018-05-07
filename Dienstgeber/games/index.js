const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");

const router = express.Router();
const db_path = "/games.json";

/**************************
 * REST API
**************************/

router.get('/', function(req, res){
	res.send("test");
});

/**************************
 * export
**************************/

module.exports = {

	router: router
}
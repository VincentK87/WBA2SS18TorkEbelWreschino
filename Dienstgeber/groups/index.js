const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");

const router = express.Router();
const dbPath = "/groups.json";

var allGroups;


/**************************
 * Object
**************************/
function Group(name, game, vor, tags) {
	if(allGroups.length == 0)
		this.id = 0;
	else
		this.id = allGroups[0].id++;
	this.name = name;
	this.mitglieder = [];
	this.warteliste = [];
	this.game = game;
	this.voraussetzungen = vor;
	this.tags = tags;
}

Group.prototype.info = function() {
	return this.name;
};

/**************************
 * REST API
**************************/
router.post('/', function(req, res){
	var group = req.body;
	if(!checkIsValidForm(group)){
		res.sendStatus(204);
	}
	else {
		var newGroup = new Group(group.name, group.game, group.voraussetzungen, group.tags);
		allGroups.push(newGroup);
	
		res.send(newGroup);
	}
});

router.get('/', function(req, res){
	res.send(allGroups);
	process.exit();    										// TODO
});

router.get('/:groupID', function(req, res){
	var group = getGroupById(req.params.groupID)
	if(group == undefined)
		res.sendStatus(404);
	else
		res.send(group);
});

router.put('/:groupID', function(req, res){
	var info = res.body;
	if(!checkIsValidForm(info)){
		res.sendStatus(204);
	}
	else {
		var group = getGroupById(req.params.groupID)
		
		group.name = info.name;
		group.game = info.game;
		group.mitglieder = info.mitglieder;
		group.warteliste = info.warteliste;
		group.voraussetzungen = info.voraussetzungen;
		group.tags = info.tags;
		
		res.send(group);
	}
});

router.delete('/:groupID', function(req, res) {
	var group = getGroupById(req.params.groupID);
	
	if(group == undefined){
		res.sendStatus(404);
	}
	else {
		delete group;
		res.sendStatus(200);
	}
});

router.get('/?tag', function(req, res){
	var TagList;
	allGroups.forEach(function(element){
		console.log(element.name);
	});
	res.send(TagList);

});

/**************************
 * Functions
**************************/
function loadDatabase() {
	fs.readFile(__dirname + dbPath, function(err, data){
		if(data.length == 0){
			console.log("file was empty");
			allGroups = [];
		}
		else
			allGroups = JSON.parse(data);
	});
};

function saveDatabase(){
	fs.writeFile(__dirname + dbPath, JSON.stringify(allGroups), function(err){
		console.log("success saving file");
	});	
}

function getGroupById(id) {
	return allGroups.find(function(element){
		return element.id == id;
	});
}

function checkIsValidForm(){
	// TODO
	return true;
}
/**************************
 * export
**************************/

module.exports = {

	router: router,

	loadData : function () {
		loadDatabase();
	},
	
	saveData : function () {
		saveDatabase();
	}
}
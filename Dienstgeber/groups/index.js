const express = require("express");
const fs = require("fs");

const router = express.Router();
const dbPath = "/groups.json";

var allGroups;
var lastId;


/**************************
 * Object
**************************/
function Group(name, game, vor, tags) {
	this.id = uniqid();
	this.name = name;
	this.mitglieder = [];
	this.warteliste = [];
	this.game = game;
	this.voraussetzungen = vor;
	this.tags = tags;

	lastId++;
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
		res.sendStatus(406);
	}
	else {
		var newGroup = new Group(group.name, group.game, group.voraussetzungen, group.tags);
		allGroups.push(newGroup);
		
		res.send(newGroup);
	}
});

router.get('/', function(req, res){
	var tag = req.query.tag;
	if(tag == undefined){
		res.send(allGroups);
	} else {
		
		var TagList = [];
		allGroups.forEach(function(element){
			element.tags.forEach(function(elem){
				if(elem == tag){
					TagList.push(element);
					return;
				}
			});
		});
		if(TagList.length == 0){
			res.sendStatus(404);
		} else 
			res.send(TagList);
	}
});

router.get('/:groupID', function(req, res){
	var group = getGroupById(req.params.groupID)
	if(group == undefined)
		res.sendStatus(404);
	else
		res.send(group);
});

router.put('/:groupID', function(req, res){
	var info = req.body;
	if(!checkIsValidForm(info)){
		res.sendStatus(406);
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
	var obj = getGroupById(req.params.groupID);
	
	if(obj == undefined){
		res.sendStatus(204);
		return;
	}
	
	var index = allGroups.indexOf(obj);
	if (index > -1) {
		allGroups.splice(index, 1);
		res.sendStatus(200);
	};

});

/**************************
 * Functions
**************************/

function getGroupById(id) {
	return allGroups.find(function(element){
		return element.id == id;
	});
}

function checkIsValidForm(data) {
	if(data == undefined)
		return false;
	if(data.name != undefined && data.game != undefined && data.voraussetzungen != undefined && data.mitglieder != undefined && data.warteliste != undefined ) 
	{
		return true;
	}
	return false
}
/**************************
 * export
**************************/

module.exports = {

	router: router,

	loadData : function (callback) {
		fs.readFile(__dirname + dbPath, function(err, data){
			if(data.length == 0){
				console.log("file was empty");
				allGroups = [];
				lastId = 0;
			}
			else {
				var parseInfo = JSON.parse(data);
				allGroups = parseInfo.data;
				lastId = parseInfo.lastId;
			}
			callback(null, err);
		})
	},
	
	saveData : function (callback) {
		var saveObj = {};
		saveObj.data = allGroups;
		saveObj.lastId = lastId;
		fs.writeFile(__dirname + dbPath, JSON.stringify(saveObj), function(err){
			callback(null, err);
		});
	}
}
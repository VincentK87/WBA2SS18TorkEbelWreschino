// require modules
const express = require("express");
const fs = require("fs");
const shortid = require('shortid');

// set up
const router = express.Router();
const dbPath = "/groups.json";

// saves all groups
var allGroups;

/*Group creates a new group
* id: automaticly generates unique id 
* name: name of the group
* members: list of members in the group
* queue: list o members waiting to enter the group
* game: the game attached to this group
* requirements: string with the requirements
* tags: list with tags to find the group
*/
function Group(name, members, queue, game, requ, tags) {
	this.id = shortid.generate();
	this.name = name;
	this.members = members;
	this.queue = queue;
	this.game = game;
	this.requirements = requ;
	this.tags = tags;
}

// returns main information of the group
Group.prototype.info = function() {
	return this.name;
};

/**************************
 * REST API
**************************/
// Creates a new group
router.post('/', function(req, res){
	console.log(req.body);
	var group = req.body;
	
	// check if request is valid
	if(!checkIsValidForm(group)){
		res.sendStatus(406);
	}
	else {
		//creates new Group and adds it to the List
		var newGroup = new Group(group.name, group.members, group.queue, group.game, group.requirements, group.tags);
		allGroups.push(newGroup);
		
		// send the new group
		res.send(newGroup);
	}
});

// GETs all groups
router.get('/', function(req, res){
	
	// check if query param is set 
	var tag = req.query.tag;
	
	if(tag == undefined) {
		// if no query param is set send all groups
		res.send(allGroups);
	} else {
		
		// if query param is set search all groups in foreach for the query
		var TagList = [];
		allGroups.forEach(function(element){
			element.tags.forEach(function(elem){
				if(elem == tag){
					
					// adds it to TagList and returns
					TagList.push(element);
					return;
				}
			});
		});
		// if none were found return 404 
		if(TagList.length == 0){
			res.sendStatus(404);
		} else 
		// else send TagList
			res.send(TagList);
	}
});

// GETs one group
router.get('/:groupID', function(req, res){
	// returns a Group by id
	var group = getGroupById(req.params.groupID)
	
	// if group is undefined return 404 else return the group
	if(group == undefined)
		res.sendStatus(404);
	else
		res.send(group);
});

// PUTs new information into existing resource
router.put('/:groupID', function(req, res) {
	
	// checks if req is a valid form
	var info = req.body;
	if(!checkIsValidForm(info)){
		res.sendStatus(406);
	}
	else {
		// gets the group
		var group = getGroupById(req.params.groupID)
		
		// if group doesnt exist return 404 and stops the script
		if(group == undefined){
			res.send(404);
			return;
		}
		
		// else update all stats
		group.name = info.name;
		group.game = info.game;
		group.members = info.members;
		group.queue = info.queue;
		group.requirements = info.requirements;
		group.tags = info.tags;
		
		res.send(group);
	}
});

// DELETEs a resource
router.delete('/:groupID', function(req, res) {

	// returns a group by id
	var obj = getGroupById(req.params.groupID);
	
	// if the group doesnt exist return 404 and stops the script
	if(obj == undefined) {
		res.sendStatus(404);
		return;
	}
	
	// gets the index in the List of an Object
	var index = allGroups.indexOf(obj);
	if (index > -1) {
	// deletes the group and return 200
		allGroups.splice(index, 1);
		res.sendStatus(200);
	};
});

/**************************
 * Functions
**************************/

// return: id of the game 
function getGroupById(id) {
	return allGroups.find(function(element){
		return element.id == id;
	});
}

// checks if the form of a group is valid
function checkIsValidForm(data) {
	if(data == undefined)
		return false;

//checks if any data is empty
	if(	data.name != undefined && 
		data.game != undefined && 
		data.requirements != undefined)
	{
		return true;
	}
	return false
}
/**************************
 * export
**************************/

// module exports into server.js file
module.exports = {

	// exports router for REST 
	router: router,

	// load Database
	// param: callback for async.waterfall
	loadData : function (callback) {
		
		// read data from json file 
		fs.readFile(__dirname + dbPath, function(err, data){
			
			//if the file is empty create empty Array
			if(data.length == 0){
				console.log("file was empty");
				allGroups = [];
			}
			// else parse JSON and save into allGroups
			else {
				var parseInfo = JSON.parse(data);
				allGroups = parseInfo.data;
			}
			// calls callback
			callback(null, err);
		})
	},
	
	// save Database
	// param: callback for async.waterfall
	saveData : function (callback) {

		//saves allGroups into File and calls callback
		var saveObj = {};
		saveObj.data = allGroups;
		fs.writeFile(__dirname + dbPath, JSON.stringify(saveObj), function(err){
			callback(null, err);
		});
	}
}
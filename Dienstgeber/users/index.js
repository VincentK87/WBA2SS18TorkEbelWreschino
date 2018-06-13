const   express = require('express'),
        fs = require('fs'),
        request = require('request'),
        shortid = require('shortid');

const   router = express.Router(),
        dbPath = "/users.json";
        
var allUsers;
var lastUserId;

/****************************
 * Object
 ****************************/

function User(name, nachname, username, games) {
    this.id = shortid.generate();
    this.name = name;
    this.nachname = nachname;
    this.username = username;
    this.games = games;

    // To Do: Bessere ID-Loesung finden!
 }

 User.prototype.info = function() {
     return this.username;
 }

 /****************************
 * REST API
 ****************************/

router.post('/', function(req, res){
    var user = req.body;

    if(!checkIsValidForm(user)) {
        res.sendStatus(406);
    } else {
        var newUser = new User(user.name, user.nachname, user.username, user.games);
        allUsers.push(newUser);

        //trying to save to users.json
        fs.writeFile("users.json", JSON.stringify(newUser), user);

        res.send(newUser);
    }
 });
 
 router.get('/', function(req, res) {
	res.status(200).type('json').send(allUsers);
 });

 router.get('/:userID', function(req, res) {

	getUserById(req.params.userID, function(user){
		if (user == undefined) {
			res.status(404).type('text').send("Der User mit der ID " + req.params.userID + " wurde nicht gefunden.");
		} else {
			res.status(200).type('json').send(user);
		}
	});
 });

 router.put('/:userID', function(req, res) {

   
	var info = req.body;

    if(!checkIsValidForm(info)) {
        res.sendStatus(406);
    } else {
        var user = getUserById(req.params.userID, function(user) {
            if(user == undefined) {
                res.send(404);
                return;
            } else {
                user.name = info.name;
                user.nachname = info.nachname;
                user.username = info.username;
                user.games = info.games;
    
                res.send(user);
            }
        });
    }
 });

 router.delete('/:userID', function(req, res) {
    
    getUserById(req.params.userID, function(obj) {
        if(obj == undefined) {
            res.sendStatus(404).type('text').send("Der Nutzer wurde nicht gefunden.");
            return;
        }
    
        var index = allUsers.indexOf(obj);
        if (index > -1) {
            allUsers.splice(index, 1);
            res.sendStatus(200).type('text').send("User #" + req.params.userID + " wurde erfolgreich gelöscht.")
        }	
    });
	
    
});


 /****************************
 * Functions
 ****************************/

 function getUserById(id, callback) {
    allUsers.find(function(element) {
		
		if(element.id == id){
			callback(element);
		} 
     });
 };

function checkIsValidForm(data) {

	if(data == undefined)
		return false;
	if(data.name != undefined && data.nachname != undefined && data.username != undefined) {
        console.log(data.games);
		if (data.games.length == 0) {
			return true;
		} else {
			data.games.forEach (function(element) {
				console.log(element);
			});
		}
		return true;
	} else {
		return false;
	}
}


 /****************************
 * Exports
 ****************************/

module.exports = {
    router: router,

    loadData : function(callback) {
        fs.readFile(__dirname + dbPath, function(err, data){

            if(data.length == 0) {
                console.log("file was empty");
                allUsers = [];
            }
            else {
                var parseInfo = JSON.parse(data);

				allUsers = parseInfo.data;
                lastUserId = parseInfo.lastUserId;

            }

            callback(null, err);
        });
    },

    saveData : function(callback) {
        var saveObj = {};
        saveObj.data = allUsers;
        saveObj.lastUserId = lastUserId;
        fs.writeFile(__dirname + dbPath, JSON.stringify(saveObj), function(err) {
            callback(null, err);
        });
    }

}
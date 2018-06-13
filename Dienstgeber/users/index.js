const   express = require('express'),
        fs = require('fs'),
        request = require('request'),
        shortid = require('shortid');

const   router = express.Router(),
        dbPath = "/users.json";
        
var allUsers;

/****************************
 * Object
 ****************************/

function User(name, nachname, username, games) {
    this.id = shortid.generate();
    this.name = name;
    this.nachname = nachname;
    this.username = username;
    this.games = games;
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
            res.sendStatus(404);
            return;
        }
    
        var index = allUsers.indexOf(obj);
        if (index > -1) {
			allUsers.splice(index, 1);
            res.sendStatus(200);
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
			return;
		} 
     });
 };

function checkIsValidForm(data) {

	if(data == undefined)
		return false;
	if(data.name != undefined && data.nachname != undefined && data.username != undefined) {

		if (data.games.length == 0) {
			return true;
		} else {
			data.games.forEach (function(element) {
				//console.log(element);
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

            }

            callback(null, err);
        });
    },

    saveData : function(callback) {
        var saveObj = {};
        saveObj.data = allUsers;
        fs.writeFile(__dirname + dbPath, JSON.stringify(saveObj), function(err) {
            callback(null, err);
        });
    }

}
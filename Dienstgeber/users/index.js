const   express = require('express'),
        bodyParser = require('body-parser'),
        fs = require('fs'),
        request = require('request');

const   router = express.Router(),
        dbPath = "/users.json";
        
var allUsers;
var lastUserId;

/****************************
 * Object
 ****************************/

function User(name, nachname, username, games) {
    this.id = lastUserId;
    this.name = name;
    this.nachname = nachname;
    this.username = username;
    this.games = games;

    lastUserId++;
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
     var game = req.query.game;

     if(game == undefined) {
         res.send(allUsers);
     } else {
         var GameList = [];
         allUsers.forEach(function(element) {
            element.games.forEach(function(elem) {
                if (elem == game) {
                    GameList.push(element);
                    return;
                }
            });
         });

         if(GameList.length == 0) {
             res.sendStatus(404);
         } else {
             res.send(users);
         }
     }

     /*
     res.send(allUsers);
     process.exit();
     */
 });

 router.get('/:userID', function(req, res) {
    var user = getUserById(req.params.userID);
    if (user == undefined) {
        res.sendStatus(404);
    } else {
        res.send(user);
    }
 });

 router.put('/:userID', function(req, res) {
    var info = res.body;
    if(!checkIsValidForm(info)) {
        res.sendStatus(406);
    } else {
        var user = getUserById(req.params.userID);

        user.name = info.name;
        user.nachname = info.nachname;
        user.username = info.username;
        user.games = info.games;

        res.send(user);
    }
 });

 router.delete('/:userID', function(req, res) {
    
    var obj = getUserById(req.params.userID);

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


 /****************************
 * Functions
 ****************************/

 /*function loadDatabase() {
    fs.readFile(__dirname + dbPath, function(err, data) {
        if(data.length == 0) {
            console.log("File was empty.");
            allUsers = [];
        } else {
            allUsers = JSON.parse(data);
        }
    });
 };

 function saveDatabase() {
     fs.writeFile(__dirname + dbPath, JSON.stringify(allUsers), function(err) {
        console.log("success saving file");
     });
 };*/

 function getUserById(id) {
     return allUsers.find(function(element) {
        return element.id == id;
     });
 };

function checkIsValidForm(data) {
    console.log(data.name);
    console.log(data.nachname);
    console.log(data.username);
    if(data == undefined)
        return false;
    if(data.name != undefined && data.nachname != undefined && data.username != undefined) {
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
        fs.readFile(__dirname + dbPath, function(err,data){

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
        var savedObj = {};
        saveObj.data = allUsers;
        saveObj.lastUserId = lastUserId;
        fs.writeFile(__dirname + dbPath, JSON.stringify(this.saveObj), function(err) {
            callback(null, err);
        });
    }

}
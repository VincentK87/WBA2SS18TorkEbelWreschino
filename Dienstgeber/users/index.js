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
 }

 User.prototype.info = function() {
     return this.username;
 }

 /****************************
 * REST API
 ****************************/

router.post('/', function(req, res){
    var users = req.body;

    if(!checkIsValidForm(users)) {
        res.sendStatus(406);
    } else {
        var newUser = new User(user.name, user.nachname, user.username, user.games);
        allUsers.push(newUser);

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
    var user = getUserId(req.params.userID);
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
    var user = getUserById(req.params.userID);

    if (user == undefined) {
        res.sendStatus(404);
        return;
    } else {
        delete user;
        res.sendStatus(200);
    }
 });


 /****************************
 * Functions
 ****************************/

 function loadDatabase() {
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
 };

 function getUserById(id) {
     return allUsers.find(function(element) {
        return element.id == id;
     });
 };

function checkIsValidForm(data) {
    if(data == undefined)
        return false;
    if(data.name != undefined && data.nachname != undefined && data.username != undefined && data.games != undefined) {
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

    loadData : function() {
        loadDatabase();
    },

    saveData : function() {
        saveDatabase();
    }

}
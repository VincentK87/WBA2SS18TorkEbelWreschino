const   express = require('express'),
        fs = require('fs');

const router = express.Router();
const dbPath = "/events.json";

var allEvents;

function Event(name, members, maxMem, queue, game, requ, tags) {
    this.id = lastEventsID;
    this.name = name;
    this.members = members;
    this.maxMem = maxMem;
    this.queue = queue;
    this.game = game;
    this.requirements = requ;
    this.tags = tags;
}

 /****************************
 * REST API
 ****************************/

 router.post('/', function(req, res) {
    console.log(req.body);
    var event = req.body;

    if(!checkIsValidForm(event)) {
        res.status(406);
    } else {
        var newEvent = new Event(event.name, event.members, event.maxMem, event.queue, event.game, event.requirements, event.tags);
        allEvents.push(newEvent);

        res.send(newEvent);
    }

 });

 router.get('/', function(req, res) {
    var tag = req.query.tag;

    if(tag == undefined) {
        res.send(allEvents);
    } else {
        var tagList = [];
        allEvents.forEach(function(element) {
            element.tags.forEach(function(elem) {
                if (elem == tag) {
                    tagList.push(element);
                    return;
                }
            });
        });

        if (tagList.length == 0) {
            res.status(404);
        } else {
            res.send(tagList);
        }
    }
 });

 router.get('/:eventID', function(req, res) {
     var event = getEventById(req.params.eventID);

     if (event == undefined) {
         res.status(404);
     } else {
         res.send(event);
     }
 });

 router.put('/:eventID', function(req, res) {
    var info = req.body;

    if (!checkIsValidForm(info)) {
        res.status(406);
    } else {
        var event = getEventById(req.params.eventID);

        if (event == undefined) {
            res.status(404);
            return;
        }

        event.name = info.name;
        event.members = info.members;
        event.maxMember = info.maxMem;
        event.queue = info.queue;
        event.game = info.game;
        event.requirements = info.requirements;
        event.tags = info.tags;
        
        res.send(event);
    }
 });

 router.delete('/:eventID', function(req, res) {
    var obj = getEventById(req.params.eventID);

    if (obj == undefined) {
        res.status(404);
        return;
    }

    var index = allEvents.indexOf(obj);
    if (index > -1) {
        allEvents.splice(index, 1);
        res.status(200);
    };
 });

  /****************************
 * Functions
 ****************************/

 function getEventById(id) {
     return allEvents.find(function(element) {
        return element.id == id;
     });
 }

 function checkIsValidForm(data) {
     if (data == undefined) {
         return false;
     }

     if (   data.name != undefined &&
            data.game != undefined &&
            data.requirements != undefined     
        ) 
        {
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

     loadData : function (callback) {
         fs.readFile(__dirname + dbPath, function(err, data) {
            if (data.length == 0) {
                console.log("empty file");
                allEvents = [];
            } else {
                var parseInfo = JSON.parse(data);
                allEvents = parseInfo.data;
            }

            callback(null, err);
         });
     },

     saveData : function (callback) {
         var saveObj = {};
         saveObj.data = allEvents;
         fs.writeFile(__dirname + dbPath, JSON.stringify(saveObj), function(err) {
            callback(null, err);
         });
     }

 }
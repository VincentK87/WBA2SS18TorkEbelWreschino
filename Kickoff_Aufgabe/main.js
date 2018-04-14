// modules
var fs = require('fs');

//variables
var citiesObj;

// Aufgabe 1
fs.readFile(__dirname+"/staedte.json", function(err, data)
{
	citiesObj = JSON.parse(data.toString()).cities;

	for(var i = citiesObj.length - 1; i >= 0; i--)
	{
		console.log("name: " + citiesObj[i].name + "\ncountry: " + citiesObj[i].country + "\npopulation: " + citiesObj[i].population + "\n--------------------");
	}
});
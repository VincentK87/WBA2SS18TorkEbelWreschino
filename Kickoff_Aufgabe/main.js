// modules
var fs = require('fs');

const chalk = require('chalk');
const log = console.log;

//variables
var citiesObj;

// Aufgabe 1
fs.readFile(__dirname+"/staedte.json", function(err, data)
{
	citiesObj = JSON.parse(data.toString()).cities;

	for(var i = citiesObj.length - 1; i >= 0; i--)
	{
		log(
			chalk.blue("name: " + citiesObj[i].name)
		+ chalk.magentaBright("\ncountry: " + citiesObj[i].country)
		+ chalk.green("\npopulation: " + citiesObj[i].population)
		+ chalk.grey("\n--------------------"));
	}
});

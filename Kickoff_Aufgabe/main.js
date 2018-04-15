// modules
var fs = require('fs');

// constat
const safePath = "\\staedte_sortiert.json";
const chalk = require('chalk');
const log = console.log;

//variables
var citiesObj;
var citiesSortet;
var jsonCities;

fs.readFile(__dirname+"/staedte.json", function(err, data)
{
	citiesObj = JSON.parse(data.toString()).cities;

	citiesSortet = citiesObj.sort(function (a, b) {
		return a.population - b.population;
	});
	
	jsonCities = JSON.stringify(citiesSortet);

	fs.writeFile(__dirname + safePath, jsonCities, function(err) {
			
		for(var i = citiesObj.length - 1; i >= 0; i--)
		{
			log(
			chalk.blue("name: " + citiesObj[i].name)
			+ chalk.magentaBright("\ncountry: " + citiesObj[i].country)
			+ chalk.green("\npopulation: " + citiesObj[i].population)
			+ chalk.grey("\n--------------------"));
		}
	});
});
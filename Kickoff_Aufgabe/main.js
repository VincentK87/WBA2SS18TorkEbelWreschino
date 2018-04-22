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
	fs.readFile(__dirname+"/mehr_staedte.json", function(err2, data2)
	{
		var tmpCities = JSON.parse(data2.toString()).cities;
		citiesObj = JSON.parse(data.toString()).cities;

		for (var j = 0; j < tmpCities.length; j++){
			citiesObj.push(tmpCities[j]);
		}
		
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
});
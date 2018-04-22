// modules
var fs = require('fs');

// constants
const safePath = __dirname + "\staedte_sortiert.json",
	chalk = require('chalk'),
	log = console.log;

//variables
var citiesObj,
	citiesSorted,
	jsonCities;

var p = new Promise(function(resolve, reject) 
{	
	
	fs.readFile(__dirname+"/staedte.json", function(err, data)
	{
		fs.readFile(__dirname+"/mehr_staedte.json", function(err, data2)
		{
			var tmpCities = JSON.parse(data2.toString()).cities;
			citiesObj = JSON.parse(data.toString()).cities;

			var combinedCities = tmpCities.concat(citiesObj);
			
			resolve(combinedCities);
		});
	});
});

p.then(function(combinedCities) 
{
	citiesSorted = combinedCities.sort(function(a, b) 
	{
		var nameA = a.name.toUpperCase(); // ignore upper and lowercase
		var nameB = b.name.toUpperCase(); // ignore upper and lowercase
		if (nameA > nameB) {
		return -1;
		}
		if (nameA < nameB) {
		return 1;
		}
	
		// namen müssen gleich sein
		return 0;
	});

	jsonCities = JSON.stringify(citiesSorted);

	fs.writeFile(__dirname + safePath, jsonCities, function(err) 
	{
			
		for(var i = citiesSorted.length - 1; i >= 0; i--)
		{
			log(
			chalk.blue("name: " + citiesSorted[i].name)
			+ chalk.magentaBright("\ncountry: " + citiesSorted[i].country)
			+ chalk.green("\npopulation: " + citiesSorted[i].population)
			+ chalk.grey("\n--------------------"));
		}
	});
}, 
function(err) 
{
	console.error("Error: " + err);
});
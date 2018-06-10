// require modules
const request = require("request");
const fs = require("fs");
const readline = require('readline');

// rl for input possability
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// path to all formats
const dbPath = "/format.json";
const README = "/README.txt";

var inEditMode = false;
var options = null;
var currentObj = null;
var AllObjects;

// settings to connect to server
const settings = {
	host: "http://localhost",
	port: 8080
};

var inMenu = true;

/**************************
 * functions
**************************/
// starts the input for the user
function startInput() {
	
	console.log("Hello !!!");
	console.log("For information about the input possabilities type 'info'");
	console.separate();

	//starts the input loop
	rl.on('line', function(input) {
		
		if(!inEditMode) {
			
			switch (input) {
			
				// output info for user
				case "info":
					fs.readFile(__dirname + README, 'utf8', function(err, data) {
						console.separate();
						console.log(data);
						console.separate();
					});
					break;
				
				// if user types REST verb 
				case "PUT":
				case "POST":
				case "GET":
				case "DELETE":
									
					// ask user what resource he/she wants
					rl.question('what resource? ', function(resource) {
						
						newRequest(input, resource);
						
						if(input == "PUT" || input == "POST") {
							
							newResource(input, resource);
						} else {
							
							sendRequest(function(data){
								console.log(data);
								console.separate();
								console.separate();
							});
						}
					});
					break;

				// close the program
				case "exit":
					console.log("Exiting program");
					rl.close();
					break;
				// if user mistypes
				default:
					console.log("invalid input");
			};
		} else {
			
			switch (input) {
				
				case "close":
					currentObj = null;
					console.log("process canceled");
					inEditMode = false;
					break;
				case "send":
					console.log(sendRequestWithData(currentObj));
					break;
				default:
					var check = input.split("=");
					
					if(check.length == 2){
						if(check[0] in currentObj) {
							currentObj[check[0]] = check[1];
							console.separate();
							console.log(currentObj);
						}
						else {
							console.log("element doesnt exist");
						}
						break;
					} 
					
					console.log("wrong format or unknown command");
					break;
			};
		};
	});
};

function newResource(method, resource) {

	if(resource in AllObjects){
		
		if (method == "POST") {
			currentObj = AllObjects[resource];
		}
		else if (method == "PUT") {
			currentObj = sendRequest();
			console.log(sendRequest());
		}
	} else {
		console.log("resource doesnt exist or doesnt support POST/PUT");
		console.separate();
		return;
	};
	
	// entering edit mode
	console.separate();
	console.log("Entered Edit mode");
	console.log(currentObj);
	
	inEditMode = true;
}

// 
function sendRequestWithData(data){
	options.body = currentObj;
	options.json = true,
	inEditMode = false;
	return sendRequest();
}

// creates the request to the server
// method: is the REST verb
// res: is the path to the resource
// data: body sending on POST or PUT
function newRequest(methodD, res, data) {
	
	// request header
	options = {
		uri : settings.host + ":" + settings.port + "/" + res,
		method : methodD,
		headers : {
			"Content-Type" : "application/json"
		}
	};
};

// sends the Request
function sendRequest() {
	
	request(options, function(err, response) {
		// if request fails -> exit
		console.separate();
		console.log("status = " + response.statusCode);
		if(err != null){
			console.log("Error" + err);
			rl.close();
			return;
		}
		return JSON.parse(response.body);
	});
}

// seperate script :)
console.separate = function() {
	console.log("**********************************************");
};

// load formats from database 
function loadData(callback) {
	fs.readFile(__dirname + dbPath, function(err, data) {
		// saves it global
		AllObjects = JSON.parse(data)[0];
		callback;
	});
}

// MAIN() Start the script
function MAIN (){
	loadData(startInput());
}
MAIN();
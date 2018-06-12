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

// editmode: when user makes input -> different functions
// options: request header
// currentObj: current editing body for request
// AllObject: loaded json file for resources
// user: authentificates user
var inEditMode = false;
var options = null;
var currentObj = null;
var AllObjects;
var user = null;

// settings to connect to server
const settings = {
	host: "http://localhost",
	port: 8080
};

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
		
		if(user == null){
			console.log("pls login first");
		}
		// check if user is NOT in editmode
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
								outputData(data);
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
		// if user is in editmode
		} else {
			
			switch (input) {
				
				// close editmode and delete the current request 
				case "close":
					currentObj = null;
					console.log("process canceled");
					inEditMode = false;
					break;
				// sends the request
				case "send":
					sendRequestWithData(currentObj, function(data){
						outputData(data);
					});
					break;
				// check if user wants to change some values
				default:
					var check = input.split("=");
					
					// check if user input was correct
					if(check.length == 2) {
						
						if(check[0] in currentObj) {

							// check if second string is an Object. if true parse it
							if(check[1].charAt(0) == "[" && check[1].charAt(check[1].length - 1) == "]") {
								check[1] = JSON.parse(check[1]);
							}
							
							// update value
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

// creates a new resource
// method: REST verb
// resource: name of resource
function newResource(method, resource) {

	// if POST load preset from AllObjects
	if (method == "POST" ) {
		if(resource in AllObjects) {
			currentObj = AllObjects[resource];
			enterEditMode();
		} else {
			console.log("resource doesnt exist or doesnt support POST/PUT");
			console.separate();
			return;
		};
	}
	// if PUT first get the resource from server and update currentObj
	else if (method == "PUT") {
		options.method = "GET";
		
		sendRequest(function(data) {
			currentObj = data;
			options.method = "PUT";
			enterEditMode();
		});
	}
}

// enterEditMode
function enterEditMode(){
	
	console.separate();
	console.log("Entered Edit mode");
	console.log(currentObj);	
	inEditMode = true;
}

// Sends the request with a body
// data: the body that should be send with request
// callback: requests the response data.
function sendRequestWithData(data, callback){
	options.body = currentObj;
	options.json = true,
	inEditMode = false;
	sendRequest(function(data){
		callback(data);
	});
}

// output Datas
function outputData(data){
	console.log(data);
	console.separate();
	console.separate();
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
function sendRequest(callback) {
	
	request(options, function(err, response) {
		// if request fails -> exit
		console.separate();
		console.log("status = " + response.statusCode);
		if(err != null){
			console.log("Error" + err);
			rl.close();
			return;
		}
		
		if(options.method == "DELETE"){
			return;
		}

		if(response.statusCode.toString()[0] == 4 ){
			console.log("Error");
		}
		else if(response.statusCode.toString()[0] == 5 ){
			console.log("Server Error");
		}
		else {
			
			if(options.method == "POST" || options.method == "PUT") {
				callback(data);
			} else {
				var data = JSON.parse(response.body);
				callback(data);
			}
		}
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
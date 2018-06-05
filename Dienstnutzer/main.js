// require modules
const request = require("request");
const readline = require('readline');

// rl for input possability
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// settings to connect to server
const settings = {
	host: "http://localhost",
	port: 8080
};

// starts the input for the user
function startInput() {
	
	console.log("Hello !!!");
	console.log("For information about the input possabilities type 'info'");
	console.separate();
	
	//starts the input loop
	rl.on('line', function(input) {
		
		switch (input){
			// output info for user
			case "info":
				console.separate();
				console.log("- 'exit' to close the program");
				console.log("\n- GET / PUT / DELETE or POST to interact with the resources");
				console.log("\n- after one of the REST verb: one of the available resources\n  - 'groups' or 'groups/{groupId}'\n  - 'games or 'games/{gamesId}'");
				console.separate();
				break;
			
			// if user types REST verb 
			case "GET":
			case "PUT":
			case "DELETE":
			case "POST":
				console.separate();
				
				// ask user what resource he wants
				rl.question('what resource? ', (resource) => {
					
					// send request for the resource
					requestRes(input, resource, function(req){
						
						console.log(req);
						console.separate();
						
						if(input == "PUT" || input == "POST") {
							
						}
					});
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
	});
};

/**************************
 * functions
**************************/
	
// creates and sends the request to the server
// method: is the REST verb
// res: is the path to the resource
// callback: returns the result when finished
function requestRes(methodD, res, callback) {
	
	// request header
	var options = {
		uri : settings.host + ":" + settings.port + "/" + res,
		method : methodD,
		headers : {
			"Content-Type" : "application/json"
		}
	};
	
	//request to server
	request(options, function(err, response) {
		// if request fails -> exit
		if(err != null){
			console.log("Error" + err);
			rl.close();
			return;
		}
		
		var data = JSON.parse(response.body);
		callback(data);
	});
};

// seperate script :)
console.separate = function() {
	console.log("**********************************************");
};

// Start the script
startInput();
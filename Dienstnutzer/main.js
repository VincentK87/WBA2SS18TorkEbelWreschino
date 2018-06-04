const request = require("request");
const readline = require('readline'); //https://nodejs.org/api/readline.html

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const settings = {
	host: "http://localhost",
	port: 8080
};

function  startInput() {

	var options = {
		uri : settings.host + ":" + settings.port + "/",
		method : 'GET',
		headers : {
			"Content-Type" : "application/json"
		}
	};
	
	rl.question('what resource? ', (answer) => {
		options.uri += answer;
		console.log(`getting resource from ${options.uri}`);
				
		request(options, function(err, response) {
			if(err != null){
				console.log("Error" + err);
				closeInput();
				return;
			}
			var data = JSON.parse(response.body);
			console.log(data);
			closeInput();
		});
	});
};

function closeInput() {
	rl.close();
}

startInput();
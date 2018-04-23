const request = require('request');
	
var gameID = "49520";
 
var url = "http://store.steampowered.com/api/appdetails?appids=" + gameID;

request(url, function (error, response, body) {
	if (!error && response.statusCode == 200) {
		var data = JSON.parse(body)[gameID];
				
		if(data.success ){
			console.log(data.data);
		}
		else {
			console.error("Error : " + error);
		}
	}
});
require('isomorphic-fetch');

var tId = "567491918";

Aufgabe1();
//getTweets(tId);
//Aufgabe3();

// Aufgabe 1
function Aufgabe1() {
	for(let x = 0; x < 10; x++) {
		console.log(x);
		setTimeout(function() {
			console.log('The number is ' + x);
		},1000);
	};
}

// Aufgabe 2
function getTweets(id) {
	return fetch("https://api.twitter.com/user/" + id)
		.then( function(response) {
			return JSON.parse(response);
		}).then(function(response) {
			return response.data;
		}).then(function(tweets) {
			return tweets.filter(function(tweet)
			{
				return tweet.stars > 50
			})
		}).then(function(tweets) {
			return tweets.filter(function(tweet) { 
				return tweet.rts > 50 
		}); 
	});
}

// Aufgabe 3
function Aufgabe3() {
	let array = [4, 1];
	console.log(sortInteger(array));
}

function sortInteger(data){
	return data.sort();
}
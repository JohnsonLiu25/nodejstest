//Analyze entire database
var redis = require('redis');
var client = redis.createClient();
var express = require('express');

var app = express();
var types = [];
var locations = [];
var minPrices = [];
var maxPrices = [];

//Averages all the values in a list
function avg(list){
	var total = 0;
	for ( var i = 0 ; i < list.length ; i++ ) {
    	total = total + list[i];
	}
	var average = total / list.length;
	return total, average.toFixed(2);
}
//Counts the number of times something appears in a list
function count(list){
	countList = {};
	for (var i = 0; i < list.length; i++){
		if (Object.keys(countList).indexOf(list[i].toLowerCase()) == -1){
			countList[list[i].toLowerCase()] = 1;
		}	else {
			countList[list[i].toLowerCase()] += 1;
		}
	}
	return countList;
}
//Sorts based on value and gives list of keys in reverse order. Keys with higher values are first in the list
function sorter(list, rev){
    return (Object.keys(list).sort(function(a, b) {return (list[a] - list[b])})).reverse();
}
//Display Data
function sortCount(list){
	var sortedKeys = sorter(count(list));
	for (var i in sortedKeys){
		var num_order = Number(i) + 1;
		console.log(num_order + ". " + sortedKeys[i] + ": " + count(list)[sortedKeys[i]]);
	}
}
//use set_total at last one
function addData(id_sender, num, list){
	client.smembers(id_sender, function(err, reply){
		for (var i in reply){
			var usable = JSON.parse(reply[i]);
			minPrices.push(usable['minPrice']);
		  	maxPrices.push(usable['maxPrice']);
		  	locations.push(usable['location']);
		  	types.push(usable['type']);
		}
	  	if (list.length == (Number(num)+1)){
	  			console.log("Locations");
	  			sortCount(locations);
	  			console.log("Types");
			    sortCount(types);
			    console.log("The average price range is: $"+avg(minPrices)+" to $"+avg(maxPrices));
			    console.log("");
			    console.log(types);
			    console.log(locations);
			    console.log(minPrices);
			    console.log(count(types));
			    console.log(count(locations));

		}
	})
}

function grabKeys(){
	client.keys('*', function (err, keys) {
		for (var j in keys){
			addData(keys[j], j, keys);
		}
	});
};


client.on('error', function(err){
    console.log('Error ' + err);
});

client.on('connect', function() {
    console.log("redis connected!");
});

//Adds sample client information to database
client.sadd("senderid",JSON.stringify({'type':'house',
        'location' : 'brooklyn',
        'minPrice' : 1000,
        'maxPrice' : 2000,
        'beds' : 2 }));
client.sadd("senderid2",JSON.stringify({'type':'villa',
        'location' : 'queens',
        'minPrice' : 2001,
        'maxPrice' : 3000,
        'beds' : 3}));
client.sadd("senderid3",JSON.stringify({'type':'House',
        'location' : 'queens',
        'minPrice' : 2021,
        'maxPrice' : 2300,
        'beds' : 3}));
client.sadd("senderid4",JSON.stringify({'type':'villa',
        'location' : 'Queens',
        'minPrice' : 1023,
        'maxPrice' : 2340,
        'beds' : 3}));
client.sadd("senderid5",JSON.stringify({'type':'villa',
        'location' : 'Manhattan',
        'minPrice' : 1400,
        'maxPrice' : 5040,
        'beds' : 3}));
grabKeys();
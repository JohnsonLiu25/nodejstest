//Testing Code. Not particularly important
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var https = require('https');

var redis = require('redis');
var client = redis.createClient();

var types = [];
var locations = [];
var minPrices = [];
var maxPrices = [];

https.get("https://joinery.nyc/api/v1/neighborhoods", function(res){
    var body = '';
    res.on('data', function(chunk){
        body += chunk;
    });
    res.on('end', function(){
        var neighborhoods = JSON.parse(body);
        all_hoods(neighborhoods);
    });
}).on('error', function(e){
        console.log("Got an error: ", e);
    });

function all_hoods(list){
	for (var i in list){
		if (list[i]['parent_neighborhood'] != null){
        	console.log(list[i]['name'].toLowerCase() + " : " + list[i]['parent_neighborhood']);
    	}
	}
}

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
		if (Object.keys(countList).indexOf(list[i]) == -1){
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
//Goes through each key
function grabKeys(){
	client.keys('*', function (err, keys) {
		grabValues(keys);
	});
};
//Runs through each key and adds to list. Also outputs average price range and popularity (needs to be run within client.smembers)
function grabValues(keys){
	for (var i = 0; i < keys.length; i++){
	  	client.smembers(keys[i], function(err, reply){
	  		var usable = JSON.parse(reply);
	  		//Outputs data of each search profile in database
	  		/*
	  		console.log("Type: " + usable['type']);
	  		console.log("Location: " + usable['location']);
	  		console.log("Min Price: " + usable['minPrice']);
	  		console.log("Max Price: " + usable['maxPrice']);
	  		console.log("");
	  		*/
	  		minPrices.push(usable['minPrice']);
	  		maxPrices.push(usable['maxPrice']);
	  		locations.push(usable['location']);
	  		types.push(usable['type']);
	  		if (types.length == keys.length){
			    console.log(count(types), sorter(count(types)));
			    console.log(count(locations), sorter(count(locations)));
			    console.log("The average price range is: $"+avg(minPrices)+" to $"+avg(maxPrices));
	  		}
	  	});
	};
}

grabKeys();
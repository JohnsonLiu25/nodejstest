//Analyze entire database - terminal
//Adding all json to list
var redis = require('redis');
var client = redis.createClient();

var express = require('express');
var app = express();

//Data lists
var jsonList = [];

//Averages all the values in a list
function avg(list){
	var total = 0;
	for ( var i = 0 ; i < list.length ; i++ ) {
    	total = total + list[i];
	}
	var average = total / list.length;
	return total, average.toFixed(2);
}
//Title case
function title(string){
	return string.replace(/^[a-z]/, function (x) {return x.toUpperCase()});
}
//Counts the number of times something appears in a list
function count(list){
	countList = {};
	for (var i = 0; i < list.length; i++){
		if (Object.keys(countList).indexOf(title(list[i])) == -1){
			countList[title(list[i])] = 1;
		}	else {
			countList[title(list[i])] += 1;
		}
	}
	return countList;
}
//Sorts based on value and gives list of keys in reverse order. Keys with higher values are first in the list
function sorter(list){
    return (Object.keys(list).sort(function(a, b) {return (list[a] - list[b])})).reverse();
}
//Displays sorted data with the count
function sortCount(list){
	var sortedKeys = sorter(count(list));
	for (var i in sortedKeys){
		var num_order = Number(i) + 1;
		console.log(num_order + ". " + sortedKeys[i] + ":\t" + count(list)[sortedKeys[i]] + '\t' + (count(list)[sortedKeys[i]]/list.length*100)+'%');
	}
}

//Gets all the keys in the database
function populateLists(){
	client.keys('*', function(err, keys) {
		for (var j in keys){
			client.smembers(keys[j], function(err, reply, callback){
				jsonList = jsonList.concat(reply);
			})
		}
	})
};

populateLists(function(what){
	console.log(what);
});
client.on('error', function(err){
    console.log('Error ' + err);
});

client.on('connect', function() {
    console.log("redis connected!");
});

populateLists();

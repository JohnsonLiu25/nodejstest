/*
	Most popular 
*/
//Opens up Redis
var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
    console.log('connected');
});
//list of data
var types = [];
var locations = [];
var minPrices = [];
var maxPrices = [];

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

//client.flushdb();


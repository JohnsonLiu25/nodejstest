//Analyzing data for one sender
var redis = require('redis');
var client = redis.createClient();

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

function sortCount(list){
	var sortedKeys = sorter(count(list));
	for (var i in sortedKeys){
		var num_order = Number(i) + 1;
		console.log(num_order + ". " + sortedKeys[i] + ": " + count(list)[sortedKeys[i]]);
	}
}

function analyzeResponse(id_sender){
	client.smembers(id_sender, function(err, reply){
	for (var i in reply){
		var usable = JSON.parse(reply[i]);
		minPrices.push(usable['minPrice']);
	  	maxPrices.push(usable['maxPrice']);
	  	locations.push(usable['location']);
	  	types.push(usable['type']);
	  	if (types.length == reply.length){
	  			console.log("Data for: " + id_sender);
	  			console.log("Locations");
	  			sortCount(locations);
	  			console.log("Types");
			    sortCount(types);
			    console.log("The average price range is: $"+avg(minPrices)+" to $"+avg(maxPrices) + "\n");
			}
	}
})
}

client.on('connect', function() {
    //console.log('connected');
});
client.sadd("senderid",JSON.stringify({'type':'villa',
        'location' : 'manhattan',
        'minPrice' : 4000,
        'maxPrice' : 4500,
        'beds' : 3}));
client.sadd("senderid2",JSON.stringify({'type':'villa',
        'location' : 'queens',
        'minPrice' : 2001,
        'maxPrice' : 3000,
        'beds' : 3}));
client.sadd("senderid2",JSON.stringify({'type':'house',
        'location' : 'brooklyn',
        'minPrice' : 3000,
        'maxPrice' : 3200,
        'beds' : 4 }));
client.sadd("senderid2",JSON.stringify({'type':'villa',
        'location' : 'queens',
        'minPrice' : 2050,
        'maxPrice' : 4000,
        'beds' : 3}));
client.sadd("senderid2",JSON.stringify({'type':'villa',
        'location' : 'manhattan',
        'minPrice' : 3200,
        'maxPrice' : 4000,
        'beds' : 3}));
analyzeResponse("senderid");
analyzeResponse("senderid2");
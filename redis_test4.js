//Analyzing data for one sender - terminal. callback working
//Note: async cannot return values
var redis = require('redis');
var client = redis.createClient();

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
function sorter(list, rev){
    return (Object.keys(list).sort(function(a, b) {return (list[a] - list[b])})).reverse();
}

//Displays sorted data with the count
function sortCount(list){
	var sortedKeys = sorter(count(list));
	for (var i in sortedKeys){
		var num_order = Number(i) + 1;
		console.log(num_order + ". " + sortedKeys[i] + "\t\t" + count(list)[sortedKeys[i]] + '\t' + (count(list)[sortedKeys[i]]/list.length*100)+'%');
	}
}

function analyzeResponse(id_sender, callback){
	var u_types = [];
	var u_locations = [];
	var u_minPrices = [];
	var u_maxPrices = [];
	client.smembers(id_sender, function(err, reply){
		for (var i in reply){
			var usable = JSON.parse(reply[i]);
			u_minPrices.push(usable['minPrice']);
		  	u_maxPrices.push(usable['maxPrice']);
		  	u_locations.push(usable['location']);
		  	u_types.push(usable['type']); 			
		}
		callback(id_sender,u_types,u_locations,u_minPrices,u_maxPrices);
	})
}

client.on('connect', function() {
    //console.log('connected');
});
analyzeResponse('senderid2', function(id_sender,u_types,u_locations,u_minPrices,u_maxPrices){
	console.log(id_sender);
	console.log("Locations\t\tNum\tPercent");
	sortCount(u_locations);
	console.log("Types\t\t\tNum\tPercent");
	sortCount(u_types);
	console.log("The average price range is: $"+avg(u_minPrices)+" to $"+avg(u_maxPrices) + "\n");
});
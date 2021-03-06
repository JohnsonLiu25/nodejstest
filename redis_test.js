//Analyze entire database - heroku - outdated
var client = require('redis').createClient(process.env.REDIS_URL);

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req,res){
    res.send(data);
} 
);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
var data = '';

//data lists
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
//Displays sorted data with the count
function sortCount(list){
	line = '';
	var sortedKeys = sorter(count(list));
	for (var i in sortedKeys){
		var num_order = Number(i) + 1;
		line += num_order + ". " + sortedKeys[i] + ": " + count(list)[sortedKeys[i]] + "<br>";
	}
	return line;
}
//Adds the values of each key to the data lists and then outputs the information to termninal.
function addData(num, list){
	client.smembers(list[num], function(err, reply){
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

		}
	})
}
//Gets all the keys in the database
function grabKeys(){
	client.keys('*', function (err, keys) {
		for (var j in keys){
			addData(j, keys);
		}
	});
};

client.on('error', function(err){
    console.log('Error ' + err);
});

client.on('connect', function() {
    console.log("redis connected!");
});

grabKeys();
//Adds sample client information to database
/*
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
*/

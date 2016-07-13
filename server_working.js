//EJS LOCAL
var redis = require('redis');
var client = redis.createClient();
var express = require('express')
    , app = module.exports = express();
 
// Using the .html extension instead of
// having to name the views as *.ejs
app.engine('.html', require('ejs').__express);
 
// Set the folder where the pages are kept
app.set('views', __dirname + '/views');
 
// This avoids having to provide the 
// extension to res.render()
app.set('view engine', 'html');
 
// Serve the index page
app.get('/', function(req, res){
  res.render('index', {
    pageTitle: 'Popular Searches',
    minPrices: minPrices,
    maxPrices: maxPrices,
    types: types,
    locations: locations
  });
});
app.get('/users', function(req, res){
  res.render('user', {
    pageTitle: 'Popular Searches',
    allkeys: list_of_keys,
    responses: responses
  });
});

if (!module.parent) {
  app.listen(8080);
  console.log('EJS Demo server started on port 8080');
}

//Data lists
var list_of_keys = [];
var responses = [];
var types = [];
var locations = [];
var minPrices = [];
var maxPrices = [];
//Gets all the keys in the database
function populateLists(){
	client.keys('*', function (err, keys) {
		for (var j in keys){
			addData(j, keys);
			list_of_keys.push(keys[j]);
		}
	});
};
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
	})
}
client.smembers('senderid', function(err, reply){
	for (var i in reply){
		usable = reply[i];
		responses.push(usable);
	}
})

client.on('error', function(err){
    console.log('Error ' + err);
});
client.on('connect', function() {
    console.log("redis connected!");
});
populateLists();
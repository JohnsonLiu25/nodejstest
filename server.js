//EJS LOCAL
var redis = require('redis');
var client = require('redis').createClient(process.env.REDIS_URL);

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
    jsonList: jsonList
  });
});
app.get('/users', function(req, res){
  res.render('user', {
    pageTitle: 'User Searches',
    allkeys: list_of_keys,
    id: 'senderid2',
    sender: sender
  });
});

app.get('/users/:id', function(req, res){
  var user_id = req.params['id'];
  addsender(user_id, function(what){
    res.render('test', {
      pageTitle: user_id,
      id: user_id,
      sender: what
    });
    what.length = 0;
  });
});

if (!module.parent) {
  app.listen(8080);
  console.log('EJS Demo server started on port 8080');
}

//Data lists
var list_of_keys = [];
var jsonList = [];
var sender = [];
//Gets all the keys in the database
function populateLists(){
	client.keys('*', function(err, keys) {
		for (var j in keys){
			client.smembers(keys[j], function(err, reply){
				jsonList = jsonList.concat(reply);
			})
			list_of_keys.push(keys[j]);
		}
	})
};
function addsender(id, callback){
  client.smembers(id, function(err, reply){
        sender = sender.concat(reply);
        callback(sender);
  })
}

client.on('error', function(err){
    console.log('Error ' + err);
});
client.on('connect', function() {
    console.log("redis connected!");
});
populateLists();
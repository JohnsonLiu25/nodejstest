var redis = require('redis');
var client = redis.createClient();
client.on('error', function(err){
    console.log('Error ' + err);
});

client.on('connect', function() {
    console.log("redis connected!");
});

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
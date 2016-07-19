var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var https = require('https');
/*
https.get("https://joinery.nyc/api/v1/listings/available", function(res){
    var body = '';
    res.on('data', function(chunk){
        body += chunk;
    });
    res.on('end', function(){
        var listings = JSON.parse(body);
        var day = 86400000;
        var week = 604800000;
        var month = 2419200000;
        setInterval(function(){avail_in_milli(listings, month, false)}, 60000)
        avail_in_milli(listings, month, false);
    });
}).on('error', function(e){
        console.log("Got an error: ", e);
    });
function avail_in_milli(list, milli, before_today){
	var date = Date.parse(new Date());
	for (var i in list){
		var avail = list[i]['available_date'];
		var time_diff = Date.parse(avail) - date;
		var do_it = false;
		if (before_today || (time_diff > 0 && time_diff < milli)) {
			 do_it = true;
		}
		if (do_it && time_diff < milli){
			console.log(list[i]['id']);
		}
	}
}
*/

var date = new Date();
console.log(date);
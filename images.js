var fs = require('fs')
  , gm = require('gm').subClass({imageMagick: true});

var express = require('express');
var app = express();

app.get('/', function(req, res){

res.set('Content-Type', 'image/jpeg'); // set the header here

gm('a.jpg')
  	.resize(Number(360*1.91),360)
  	.montage('b.jpg')
  	.montage('c.jpg')
  	.montage('e.jpg')
  	.geometry('+0+0')
    .stream(function (err, stdout, stderr) {
      stdout.pipe(res)
    });

});

app.listen(3000);
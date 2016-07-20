var express = require('express')
  , fs  = require('fs')
  , app = express()
  , port = process.env.PORT || 3000;

 var async = require('async');

var Canvas = require('canvas')
  , Image = Canvas.Image
  , canvas = new Canvas(978, 512)
  , ctx = canvas.getContext('2d');

function resizeandPaste(image, x, y){
	fs.readFile(image, function(err, squid){
	  	if (err) throw err;
		img = new Image;
		img.src = squid;
		var ow = img.width;
		var oh = img.height;
		var aspect = ow / oh;
		var IDEAL_W = 489;
		var IDEAL_H = 256;
		var ASPECT = 1.91;
		
			if(aspect > ASPECT){
		    console.log('aspect > ASPECT');
		    w = ASPECT * oh;
		    h = oh;
		    offset = (ow - w)/2;
		    ctx.drawImage(img, offset, 0, w-offset, h , x, y, IDEAL_W, IDEAL_H);
		}
		//Crop Top and bottom
		else{
		    console.log('aspect < ASPECT');
		    h = ow / 1.91;
		    w = ow;
		    offset = (oh - h)/2;
		    ctx.drawImage(img, 0, offset, w  , h , x, y, IDEAL_W, IDEAL_H); 
		}

		
	});
}
function makeCanvas(im_1,im_2,im_3,im_4){
	resizeandPaste(im_1, 0, 0);
	resizeandPaste(im_2, 0, 256);
	resizeandPaste(im_3, 489, 0);
	resizeandPaste(im_4, 489, 256);
}
app.get('/', function(req, res){
	res.set('Content-Type', 'image/jpeg'); 
	makeCanvas('a.jpg','e.jpg','c.jpg','f.jpeg');
	setTimeout(function(){
		canvas.jpegStream().pipe(res);
	}, 50);
});

app.listen(port, function(){
  	console.log('Listenting on ' + port);
});
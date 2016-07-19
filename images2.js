//WORKING CODE -- ????????
var im = require('imagemagick');
var fs = require('fs')
  , gm = require('gm').subClass({imageMagick: true});
var async = require('async');
//Size to turn image to
var ideal_width = 489;
var ideal_height = 256;
var ideal_ar = ideal_width/ideal_height;

//Gets the width and height of the image
function getSize(image, callback){
	gm(image)
	.size(function(err, size){
		var ar = size.width/size.height;
		callback(ar, size.width, size.height);
	})
}

//montage works if all images are the same size
//uses the height and width to crop the image and then resize
function resize(paths, callback){
	getSize(paths, function(aspect, width, height){
		if (aspect > ideal_ar){
			var new_width = ideal_ar * height;
			var new_height = hieght
		} else {
			var new_height = width / ideal_ar;
			var new_width = width;
		}
		console.log(new_width, new_height);
		gm(paths)
		.gravity('Center')
		.crop(new_width,new_height)
		.resizeExact(ideal_width,ideal_height)
		.geometry('+0+0')
		.write(paths.slice(0,-4)+'-cropped.jpg', function(){})
	});
}
function montageMe(a,b,c,d){
	console.log('montage');
	gm()
	    .in('-page', '+0+0')  // Custom place for each of the images
	    .in(a.slice(0,-4)+'-cropped.jpg')
	    .in('-page', '+489+0')
	    .in(b.slice(0,-4)+'-cropped.jpg')
	    .in('-page', '+0+256')
	    .in(c.slice(0,-4)+'-cropped.jpg')
	    .in('-page', '+489+256')
	    .in(d.slice(0,-4)+'-cropped.jpg')
	    .mosaic()  // Merges the images as a matrix
	    .write('output.jpg', function (err) {
	        if (err) console.log(err);
	    });
}




	
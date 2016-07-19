var im = require('imagemagick');
var fs = require('fs')
  , gm = require('gm').subClass({imageMagick: true});
var async = require('async');
//Size to turn image to
var ideal_width = 489;
var ideal_height = 256;
var ideal_ar = ideal_width/ideal_height;

function resize(image){
	async.waterfall([
    function(callback) {
    	gm(image)
		.size(function(err, size){
			var ar = size.width/size.height;
			callback(null, ar, size.width, size.height);
		})
        
    },
    function(aspect, width, height, callback) {
		if (aspect > ideal_ar){
			var new_width = ideal_ar * height;
			var new_height = hieght
		} else {
			var new_height = width / ideal_ar;
			var new_width = width;
		}
		console.log(new_width, new_height);
		gm(image)
		.gravity('Center')
		.crop(new_width,new_height)
		.resizeExact(ideal_width,ideal_height)
		.geometry('+0+0')
		.write(image.slice(0,-4)+'-cropped.jpg', function(){})
		callback(null, image.slice(0,-4)+'-cropped.jpg')
		}
], function (err, result) {
});
}
openFiles = ['a.jpg','b.jpg','c.jpg','d.jpg']
async.each(openFiles, function(file, callback) {
    console.log('Processing file ' + file);
    resize(file);
}, function(err) {
    // if any of the file processing produced an error, err would equal that error
    if( err ) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log('A file failed to process');
    } else {
      console.log('All files have been processed successfully');
    }
});
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
/*
async.series([
    function(callback) {
       resize_all('a.jpg','b.jpg','c.jpg','d.jpg');
       callback();
    },
    function(callback) {
       montageMe('a.jpg','b.jpg','c.jpg','d.jpg');
    }
],
// optional callback
function(err, results) {
    // results is now equal to ['one', 'two']
});
*/
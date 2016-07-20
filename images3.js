var im = require('imagemagick');
var fs = require('fs')
  , gm = require('gm').subClass({imageMagick: true});
var Sync = require('sync');
var deasync = require('deasync');
var async = require('async');

//Size to turn image to
var ideal_width = 489;
var ideal_height = 256;
var ideal_ar = ideal_width/ideal_height;

function resize(image, callback){
    async.waterfall([
	function(callback) {
    	    gm(image)
		.size(function(err, size){
		    var ar = size.width/size.height;
		    callback(null, ar, size.width, size.height);
		});
	    console.log(image);  
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
		.write(image.slice(0,-4)+'-cropped.jpg', function(){});
	    callback(null, image.slice(0,-4)+'-cropped.jpg');
	}, 

    ], function (err, result) {
	console.log(result);
    });
    callback(null, image.slice(0,-4)+'-cropped.jpg');
}
//openFiles = ['a.jpg','b.jpg','c.jpg','d.jpg']

function resize_all(a,b,c,d){
    var count = 0;
    async.series([
	function(callback) {
	    resize(count, a);
	    callback(null, a);
	},
	function(callback) {
	    resize(count, b);
	    callback(null, b);
	},
	function(callback) {
	    resize(count, c);
	    callback(null, c);
	},
	function(callback) {
	    resize(count, d);
	    callback(null, d);
	    
	}
    ], 
		 // optional callback
		 function(err, results) {
		     // results is now equal to ['one', 'two']
		     //montageMe(results[0],results[1],results[2],results[3]);
		     console.log(results);
		     
		 });
}


function checkFile(file){
    fs.stat(file, function(err, stat) {
	if(err == null) {
            return true;
	    if(err.code == 'ENOENT') {
		// file does not exist
		return false;
	    } else {
		return false;
	    }
	}
    });
	   
}

function asyncFunction(a, b, callback) {
    process.nextTick(function(){
        callback(null, a + b);
    });
}

// Run in a fiber 
// Sync(function(){
//     var a = resize.sync(null,'a.jpg');
//     while (a == undefined){}
//     console.log(a);
//     resize.sync(null,'b.jpg');
//     resize.sync(null,'c.jpg');
//     resize.sync(null,'d.jpg');
//     console.log('Hi');
//     montageMe.sync(null,'a.jpg','b.jpg','c.jpg','d.jpg');
// });

//resize_all('a.jpg','b.jpg','c.jpg','d.jpg');

// async.each(openFiles, function(file, callback) {
//     console.log('Processing file ' + file);
//     resize(file);
// }, function(err) {
//     // if any of the file processing produced an error, err would equal that error
//     if( err ) {
//       // One of the iterations produced an error.
//       // All processing will now stop.
//       console.log('A file failed to process');
//     } else {
//       console.log('All files have been processed successfully');
//     }
// });


function montageMe(a,b,c,d,callback){
    console.log('montage');
    while( checkFile('a-cropped.jpg'))
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

resize('a.jpg', function(){    
    resize('b.jpg', function(){
	resize('c.jpg', function(){
	    resize('d.jpg', function(){
		montageMe('a.jpg', 'b.jpg', 'c.jpg', 'd.jpg');

	    });

	});

    });
    
});

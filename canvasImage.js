var fs = require('fs');
var Canvas = require('canvas');
var Image = Canvas.Image;
var img = new Image();

var ASPECT = 1.91; 
var IDEAL_W = 256 * 1.91;
var IDEAL_H = 256;

//Resizes the img Image object, with the canvas settings ctx,
//Canvas canvas, and sets it on coord x,y into a montage.jpg
function ResizeImg(img, ctx,canvas,x,y) {
    var ow = img.width;
    var oh = img.height;
    var aspect = ow/oh;
    var w,h;
    var offset;
    
    //Crop left and right
    if(aspect > ASPECT){
    	w = ASPECT * oh;
    	h = oh;
    	offset = (ow - w)/2;
    	ctx.drawImage(img, offset, 0, w-offset, h , x, y, IDEAL_W, IDEAL_H);
    }
    //Crop Top and bottom
    else{
    	h = ow / ASPECT;
    	w = ow;
    	offset = (oh - h)/2;
    	ctx.drawImage(img, 0, offset, w  , h , x, y, IDEAL_W, IDEAL_H); 
    }

    var out = fs.createWriteStream('montage.jpg');
    var stream = canvas.createJPEGStream({
	//Default values
    });

    stream.pipe(out);
}

//Takes four dir to four images
function resize(image,image2, image3, image4){
    var canvas = new Canvas(IDEAL_W * 2 , IDEAL_H * 2);
    var ctx = canvas.getContext('2d');

    fs.readFile(image, function(err,data){
	var img = new Image();
	img.src = data; 
	ResizeImg(img,ctx,canvas,0,0);
    });

    fs.readFile(image2, function(err,data){
	var img = new Image();
	img.src = data; 
	ResizeImg(img,ctx,canvas,IDEAL_W,0);
    });

    fs.readFile(image3, function(err,data){
	var img = new Image();
	img.src = data; 
	ResizeImg(img,ctx,canvas,0,IDEAL_H);
    });

    fs.readFile(image4, function(err,data){
	var img = new Image();
	img.src = data; 
	ResizeImg(img,ctx,canvas,IDEAL_W,IDEAL_H);
    });
}


//Puts all the resize into one function
function montage(a,b,c,d){
    resize(a, b, c, d);
}

montage('a.jpg','b.jpg','c.jpg','e.jpg');

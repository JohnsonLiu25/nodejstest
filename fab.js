// Read Synchrously
var fs = require("fs");
var content = fs.readFileSync("test.json");
var jsonContent = JSON.parse(content);
/*
for (var i in jsonContent){
	console.log(jsonContent[i]);
}*/
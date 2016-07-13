<%
avg = function (list){
	var total = 0;
	for ( var i = 0 ; i < list.length ; i++ ) {
    	total = total + list[i];
	}
	var average = total / list.length;
	return total, average.toFixed(2);
}

title = function (string){
	return string.replace(/^[a-z]/, function (x) {return x.toUpperCase()});
}

count = function (list){
	countList = {};
	for (var i = 0; i < list.length; i++){
		if (Object.keys(countList).indexOf(title(list[i])) == -1){
			countList[title(list[i])] = 1;
		}	else {
			countList[title(list[i])] += 1;
		}
	}
	return countList;
}

sorter = function (list){
    return (Object.keys(list).sort(function(a, b) {return (list[a] - list[b])})).reverse();
}

addtoList = function(list){
	dict = {};
	types = [];
	locations = [];
	maxPrices = [];
	minPrices = [];
	beds = [];
	for (var i in list){
		newList = JSON.parse(list[i]);
		types.push(newList['type']);
		locations.push(newList['location']);
		maxPrices.push(newList['maxPrice']);
		minPrices.push(newList['minPrice'])
	}
	dict['types'] = types;
	dict['locations'] = locations;
	dict['minPrices'] = minPrices;
	dict['maxPrices'] = maxPrices;
	return dict;
}
%>
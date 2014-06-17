/**
 * New node file
 */
// var util = require('util');
var path = '/Users/frank_feng1/Desktop/alert_data.csv';
// util.debug(exists ? "it's there" : "no passwd!");


var dao = require('./dao');
var fs = require('fs'), readline = require('readline');

var rd = readline.createInterface({
	input : fs.createReadStream(path),
	output : process.stdout,
	terminal : false
});

rd.on('line', function(line) {
	var data = line.split(',');
	if (parseInt(data[2]) >= 0 && data[0].toLowerCase().indexOf("test") == -1) {
		 dao.insertAllDataFromCSV(data[0],data[1],data[2],data[3]);
	}
});

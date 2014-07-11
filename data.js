
// var util = require('util');
// util.debug(exists ? "it's there" : "no passwd!");

var dao = require('./dao');
var fs = require('fs'), readline = require('readline');
var matedata = [];

/*read data from .CSV*/
function insertIntoAlertHistory(){
	var path = '/Users/frank_feng1/Desktop/alert_data.csv';
	var rd = readline.createInterface({
		input : fs.createReadStream(path),
		output : process.stdout,
		terminal : false
	});
	
	rd.on('line', function(line) {
		var data = line.split(',');
		console.log(data[6]);
		if (parseInt(data[2]) >= 0 && data[0].toLowerCase().indexOf("test") == -1) {
			dao.insertAllDataFromCSV(data[0],data[1],data[2],data[3]);
		}
	});
}

function isExist(data){
	for( var i = 0 ; i < matedata.length; i++){
		if(matedata[i] == data) return true;
	}
	
	return false;
}

//insertIntoAlertHistory();

/*read data from .xls*/
function uploadData(){
	var basePath = '~/Desktop/';
	//var inputFile = basePath + "mntr_alert_meta_data_codsp.xls";
	var inputFile = basePath + "alert_data_20140710-1440.xlsx";
	var spreadsheet=require('node_spreadsheet');
	
	spreadsheet.read(inputFile, function(err, data) {
		if(err) console.log(err);    
		console.log("in");
		for(var i in data){
			
			/* insert matedata from .xlsx to mysql*/
			if(data[i][0] === "ALERT_ID" || data[i][0] ==="") continue;
			
			if (parseInt(data[i][2]) >= 0 && data[i][0].toLowerCase().indexOf("test") == -1) {
				var row = {
						ALERT_ID:data[i][0], 
						ALERT_TIME:new Date(data[i][1]), 
						ALERT_VALUE:data[i][2], 
						ALERT_TYPE:data[i][3]
					};
				console.log(row);
				dao.insertLastestData(row);
			}
			
			if(!isExist(data[i][0])){
				matedata.push(data[i][0]);
				var row = {
						ALERT_ID       : data[i][0],
						ALERT_NAME     : data[i][5],
						QUERY_INFO     : data[i][6],
						FREQUENCY      : data[i][7],
						THRESHOLD_VALUE: data[i][8],
						WARNING_START  : data[i][11],
						WARNING_END    : data[i][12],
						ALERT_START    : data[i][13],
						ALERT_END      : data[i][14] > 999999 ? 999999: data[i][14],
						ALERT_FLAG     : data[i][9],
						MAIL_LIST      : data[i][10],
						TASK_TYPE      : data[i][17]
				};
				console.log(row);
				dao.insertMateData(row);
			}
		} 
	});
}

uploadData();
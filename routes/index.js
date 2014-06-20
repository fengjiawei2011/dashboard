var dao = require('../dao');

var datasetArray = [];
var alertIdArray = [];


exports.index = function(req, res){	
	dao.selectAlertIdV1(function(rows){
		getSortedAlertIdArray(rows);
		var temp = alertIdArray.shift();
		getAlertData(res , temp);	
	});
	console.log("finally done");	
}

function getSortedAlertIdArray(dbRows){
	for(var i in dbRows){
		alertIdArray.push(dbRows[i].ALERT_ID);
	}
	sortByAlertId(alertIdArray);
}

function getAlertData(res, alertId){
	if(alertId){
		//console.log("alertId = " + alertId);
		dao.queryAlertDataByAlertIdV1(alertId,function(rows){
			var alertData = parse2JSON(alertId, rows);
			var convertedData = parse2FlotDatasetFormat(alertData);		
			datasetArray.push(convertedData);
			//console.log(datasetArray);
			return getAlertData(res,alertIdArray.shift());
		});
		return "inprocess";
	}else{
		var d = datasetArray;
		cleanArray();
		res.render('index', { title: 'Express', alertType : 'A24', datasets:JSON.stringify(d)});
	}
}

// get data from mysql , then parse them to JSON format data
function parse2JSON(alertId, dbRows){
	var data = {alertId : alertId, alertData:[], matedata : {}};
    for (var i in dbRows) {
    	delete dbRows[i].ID;
    	delete dbRows[i].ALERT_ID;
    	data.alertData.push(dbRows[i]);
    }
    return data;
}

function cleanArray(){
	datasetArray =[];
	alertIdArray =[];
}

//sort alert id array
function sortByAlertId(alertIds){
	for(var i = 0; i < alertIds.length - 1; i++){
		var min = parse2Int(alertIds[i]);
		var minIndex = i; 
		for(var j = i+1; j < alertIds.length; j++){
			if( min > parse2Int(alertIds[j])){
				min  = parse2Int(alertIds[j]);
				minIndex = j;
			}
		}
		var temp = alertIds[i];
		alertIds[i] = 'A'+min;
		alertIds[minIndex] = temp;
	}
}

function parse2Int(alertId){
	return parseInt(alertId.substring(1,alertId.length));
}

//return flot format datasets
function parse2FlotDatasetFormat(alertData){
	var datasets = {};
	var dataset = alertData.alertData; 
	var flotFormatDataset = [];
	for(var i = 0; i < dataset.length; i++){
		var time = new Date(dataset[i].ALERT_TIME).getTime();
		var temp = [time, dataset[i].ALERT_VALUE];
		flotFormatDataset.push(temp);
	}
	datasets['alertId'] = alertData.alertId;
	datasets['dataset'] = flotFormatDataset;
	return datasets;
}

function gd(year, month, day) {
    return new Date(year, month, day).getTime();
}

//this.index();

/*
 * get data from excel
 * 
 * 

var spreadsheet=require('node_spreadsheet');
var basePath = '~/Desktop/';
var inputFile = basePath + "alerts.xlsx";

spreadsheet.read(inputFile, function(err, data) {
if(err) console.log(err);    
var dashboardData = [];
for(var i in data){
	if(data[i][4] !== 'ALERT_VALUE'){
		if(data[i][4] >= 0){
			var temp = [ new Date(data[i][3]).getTime() , parseInt(data[i][4]) ];
    		dashboardData.push(temp);
		}else{
			console.log(data[i][4]);
		}
	}
} 
console.log(dashboardData);
*/

/*
 * get data from mysql
 * 
mysql = require('mysql');;



var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'DFTAlert'
});
exports.index = function(req, res){	

	var queryString = 'SELECT ALERT_ID FROM ALERT_HISTORY';
	
	var alertTyp = "";
	connection.query(queryString, function(err, rows, fields) {
	    if (err) throw err;
	 
	    for (var i in rows) {
	        alertType = rows[i].ALERT_ID;
	    }
	    res.render('index', { title: 'Express', data : mydata, alertType : alertType});
	});	  
	
};

*/



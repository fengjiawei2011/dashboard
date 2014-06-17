

//var jquery = require('jquery');
//var spreadsheet=require('node_spreadsheet');
//var basePath = '~/Desktop/';
//var inputFile = basePath + "alerts.xlsx";

var dao = require('../dao');

var datasetArray = [];
var alertIdArray = [];
exports.index = function(req, res){	
	
	dao.selectAlertId(function(data){
		alertIdArray = data; 
		var temp = alertIdArray.shift();
		getAlertData(res , temp);	
	});
	console.log("finally done");	
}

function getAlertData(res, alertId){
	
	if(alertId){
		//console.log("alertId = " + alertId);
		dao.queryAlertDataByAlertId(alertId,function(alertData){	
			var convertedData = parse2FlotDatasetFormat(alertData);		
			datasetArray.push(convertedData);
			//console.log(datasetArray);
			return getAlertData(res,alertIdArray.shift());
		});
		return "inprocess";
	}else{
		var d = datasetArray;
		datasetArray =[];
		alertIdArray =[];
		res.render('index', { title: 'Express', alertType : 'A24', datasets:JSON.stringify(d)});
	}
}

//return dataset array
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
res.render('index', { title: 'Express', data : dashboardData, alertID : "A24"});
});
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



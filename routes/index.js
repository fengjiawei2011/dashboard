var dao = require('../dao');

var datasetArray = [];
var alertIdArray = [];


exports.index = function(req, res){	
	dao.selectAlertIdV1(function(rows){
		alertIdArray = getSortedAlertIdArray(rows);
		var temp = alertIdArray.shift();
		getAlertData(res , temp);	
	});
	console.log("finally done");	
}

// get raw data in DB sorted 
function getSortedAlertIdArray(dbRows){
	var array = [];
	for(var i in dbRows){
		array.push(dbRows[i].ALERT_ID);
	}
	// sort algorithms 
	sortByAlertId(array);
	
	return array;
}


function getAlertData(response, alertId){
	if(alertId){
		dao.queryAlertDataByAlertIdV1(alertId,function(rows){
			var alertData = parse2JSON(alertId, rows);
			//var convertedData = parse2FlotDatasetFormat(alertData);		
			datasetArray.push(alertData);
			//datasetArray = rows;
			//datasetArray.push(rows);	
			return getAlertData(response,alertIdArray.shift());
		});
		//return "inprocess";
	}else{
		console.log(datasetArray);
		var d = datasetArray;
		cleanArray();
		response.render('index1', { title: 'Express', datasets:JSON.stringify(d)});
	}
}

// get data from mysql , then parse them to JSON format data
function parse2JSON(alertId, dbRows){
	var data = {alertId : alertId, alertData:[], matedata : {}};
	data.matedata = getMatedata(dbRows[0]);
    for (var i in dbRows) {
    	//delete dbRows[i].ID;
    	//delete dbRows[i].ALERT_ID;
    	var temp = {};
    	temp.alertTime = dbRows[i].ALERT_TIME;
    	temp.alertValue = dbRows[i].ALERT_VALUE;
    	temp.alertType = dbRows[i].ALERT_TYPE;
    	data.alertData.push(temp);
    	//data.matedata.sql = dbRows[i].QUERY_INFO;
    	//data.matedata.alertName = dbRows[i].ALERT_NAME;
    }
    return data;
}

function cleanArray(){
	datasetArray =[];
	alertIdArray =[];
}


//get matedata from query result 
function getMatedata(row){
	var matedata = {};
	matedata.sql = row.QUERY_INFO;
	matedata.alertName = row.ALERT_NAME;
	matedata.frequency = row.FREQUENCY;
	matedata.threshold = row.THRESHOLD_VALUE;
	matedata.warningStart = row.WARNING_START;
	matedata.warningEnd = row.WARNING_END;
	matedata.alertStart = row.ALERT_START;
	matedata.alertEnd = row.ALERT_END;
	matedata.alertFlag = row.ALERT_FLAG;
	matedata.mailList = row.MAIL_LIST;
	matedata.taskType = row.TASK_TYPE;
	return matedata;
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


//parse alert id to INT which is used to sort
function parse2Int(alertId){
	return parseInt(alertId.substring(1,alertId.length));
}



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



/**
 * New node file
 */

var mysql = require('mysql');;

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'DFTAlert'
});

exports.insertAllDataFromCSV = function(alertId, aLertTime, alertValue, alertType){	
	
	var row = {ALERT_ID:alertId, ALERT_TIME:new Date(aLertTime), ALERT_VALUE:alertValue, ALERT_TYPE:alertType}
	connection.query("INSERT INTO ALERT_HISTORY SET ?" , row,  function(err, result) { 
		if(err) throw err;
		console.log("insert successfully ============" + result);	
	});	  
};

exports.queryAlertDataByAlertId = function(alertId,callback){
	var queryString = "SELECT * FROM ALERT_HISTORY WHERE ALERT_ID = '"+alertId+"' ORDER BY ALERT_TIME ASC";
	connection.query(queryString, function(err, rows, fields) {
	    if (err) throw err;
	    var data = {alertId : alertId, alertData:[]};
	    for (var i in rows) {
	    	delete rows[i].ID;
	    	delete rows[i].ALERT_ID;
	    	data.alertData.push(rows[i]);
	    }
	   // console.log("data"+data)
	    callback(data);
	});	 
}

exports.selectAlertId = function(callback){
	var queryString = "SELECT distinct(ALERT_ID) FROM ALERT_HISTORY";
	//var aa = [];
	connection.query(queryString, function(err,rows,fields){
		if(err) throw err;	
		var alertArray = [];
		for(var i in rows){
			alertArray.push(rows[i].ALERT_ID);
			//console.log(rows[i].ALERT_ID);
		}
		sortByAlertId(alertArray);
		
		callback(alertArray);
	});
}

function sortByAlertId(alertIds){
	console.log("before sort :"+alertArray.length);
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
	
	console.log("after sort :"+alertArray.length); 
}

function parse2Int(alertId){
	return parseInt(alertId.substring(1,alertId.length));
}
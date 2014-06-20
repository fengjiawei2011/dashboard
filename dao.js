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

exports.insertMateData = function(row){
	connection.query("INSERT INTO ALERT_MATEDATA SET ?", row , function(err, result){
		if(err) throw err;
		console.log("insert successfully ============" + result);	
	});
}

exports.queryAlertDataByAlertIdV1 = function(alertId, callback){
	var queryString = "SELECT * FROM ALERT_HISTORY a JOIN ALERT_MATEDATA b ON a.ALERT_ID=b.ALERT_ID WHERE a.ALERT_ID = '"+alertId+"' ORDER BY a.ALERT_TIME ASC";
	connection.query(queryString, function(err, rows, fields) {
	    if (err) throw err;
	    callback(rows);
	});	 
}


exports.selectAlertIdV1 = function(callback){
	var queryString = "SELECT distinct(ALERT_ID) FROM ALERT_HISTORY";
	connection.query(queryString, function(err,rows,fields){
		if(err) throw err;	
		callback(rows);
	});
}

/*
 * not good code
 * 
exports.queryAlertDataByAlertId = function(alertId,callback){
	var queryString = "SELECT * FROM ALERT_HISTORY a JOIN ALERT_MATEDATA b ON a.ALERT_ID=b.ALERT_ID WHERE a.ALERT_ID = '"+alertId+"' ORDER BY a.ALERT_TIME ASC";
	connection.query(queryString, function(err, rows, fields) {
	    if (err) throw err;
	    var data = {alertId : alertId, alertData:[], matedata : {}};
	    console.log(rows);
	    for (var i in rows) {
	    	delete rows[i].ID;
	    	delete rows[i].ALERT_ID;
	    	data.alertData.push(rows[i]);
	    }
	    callback(data);
	});	 
}

exports.selectAlertId = function(callback){
	var queryString = "SELECT distinct(ALERT_ID) FROM ALERT_HISTORY";
	//var aa = [];
	connection.query(queryString, function(err,rows,fields){
		if(err) throw err;	
		console.log(rows);
		var alertArray = [];
		for(var i in rows){
			alertArray.push(rows[i].ALERT_ID);
			//console.log(rows[i].ALERT_ID);
		}
		sortByAlertId(alertArray);
		
		callback(alertArray);
	});
}

*/

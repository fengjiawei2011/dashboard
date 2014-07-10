var util = require('util');
var mysql = require('mysql');;

var connection = mysql.createConnection({
	host     : '10.72.113.192',
	//host : 'localhost',
	port     : '7771',
	user     : 'root',
	password : '123!@#qweQWE',
	//password : '',
	database : 'DFTAlert'
});

exports.insertAllDataFromCSV = function(alertId, aLertTime, alertValue, alertType){	
	
	var row = {ALERT_ID:alertId, ALERT_TIME:new Date(aLertTime), ALERT_VALUE:alertValue, ALERT_TYPE:alertType}
	connection.query("INSERT INTO ALERT_HISTORY SET ?" , row,  function(err, result) { 
		if(err) {
			util.debug("insertAllDataFromCSV()  error !");
			throw err;
		}
		util.debug("insertAllDataFromCSV() successfully ! Return result is " + result);
	});	  
};

exports.insertMateData = function(row){
	connection.query("INSERT INTO ALERT_MATEDATA SET ?", row , function(err, result){
		if(err){
			throw err;
			util.debug("insertMateData()  error !");
		}
		util.debug("insertMateData() successfully ! Return result is " + result);
	});
}


exports.queryAllAlertDataV2 = function(callback){
	//var queryString = "SELECT *  FROM ALERT_HISTORY ORDER BY ALERT_TIME";
	var queryString = "SELECT *  FROM ALERT_HISTORY a JOIN ALERT_MATEDATA b ON a.ALERT_ID=b.ALERT_ID ORDER BY ALERT_TIME";
	connection.query(queryString, function(err, rows, fields) {
	    if (err){
	    	util.debug("queryAllAlertDataV2() ERROR!!! QUERY : " + queryString);
	    	throw err;
	    }
	    util.debug("queryAllAlertDataV2() successfully");
	    callback(rows);
	});	 
}

exports.queryAllAlertData = function(callback){
	var queryString = "SELECT *  FROM ALERT_HISTORY ORDER BY ALERT_TIME";
	connection.query(queryString, function(err, rows, fields) {
	    if (err){
	    	util.debug("queryAllAlertData() ERROR!!! QUERY : " + queryString);
	    	throw err;
	    }
	    util.debug("queryAllAlertData() successfully");
	    callback(rows);
	});	 
}

exports.queryAlertDataByAlertIdV1 = function(alertId, callback){
	var queryString = "SELECT * FROM ALERT_HISTORY a JOIN ALERT_MATEDATA b ON a.ALERT_ID=b.ALERT_ID WHERE a.ALERT_ID = '"+alertId+"' ORDER BY a.ALERT_TIME ASC";
	connection.query(queryString, function(err, rows, fields) {
	    if (err){
	    	util.debug("queryAlertDataByAlertIdV1() ERROR!!! QUERY : " + queryString);
	    	throw err;
	    }
	    util.debug("queryAlertDataByAlertIdV1() successfully");
	    callback(rows);
	});	 
}

exports.selectAllAlertsMateData = function(callback){
var queryString = "SELECT * FROM ALERT_MATEDATA";
	
	connection.query(queryString, function(err,rows,fields){
		if(err){
			util.debug("selectAllAlertsMateData() ERROR!!! QUERY : " + queryString);
			throw err;	
		}
		util.debug("selectAllAlertsMateData() successfully");
		callback(rows);
	});
}

exports.selectAlertIdV1 = function(callback){
	var queryString = "SELECT distinct(ALERT_ID) FROM ALERT_HISTORY";
	
	connection.query(queryString, function(err,rows,fields){
		if(err){
			util.debug("selectAlertIdV1() ERROR!!! QUERY : " + queryString);
			throw err;	
		}
		util.debug("queryAlertDataByAlertIdV1() successfully");
		callback(rows);
	});
}

/*
console.log(connection);
this.selectAlertIdV1(function(r){
	console.log(r);
});
*/
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

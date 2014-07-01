var dao = require('../dao');

var datasetArray = [];
var alertIdArray = [];
var timeStart;
var timeEnd;

exports.index = function(req, res){	
	
	timeStart = new Date().getMilliseconds();
	//getDataAndPassToFronEnd(req , res);
	//getDataAndPassToFronEndV1(req , res);
	getDataAndPassToFronEndV2(req , res);
	
	console.log("finally done");	
}


//***************v2 start*********************************

// parse2JSON(rows)
function getDataAndPassToFronEndV2(req , res){
	var datasetArrayV2 = [];
	dao.queryAllAlertDataV2(function(rows){
		for( var i = 0; i < rows.length; i++){
			var obj = isObjExisted(rows[i].ALERT_ID, datasetArrayV2);
			//console.log(obj);
			if( obj ){
				//console.log(JSON.stringify(obj));
				obj.alertData.push(extractData(rows[i]));
			}else{
				var dataset  = {alertId : '', alertData : [] , matedata :{}};
				dataset.alertId  = rows[i].ALERT_ID;
				dataset.alertData.push(extractData(rows[i]));
				dataset.matedata = getMatedata(rows[i]);
				datasetArrayV2.push(dataset);
			}	
		}
		//console.log(JSON.stringify(datasetArrayV2));
		timeEnd = new Date().getMilliseconds();
		console.log("method three take : " + (timeEnd - timeStart));
		res.render('index1', { title: 'Express', datasets:JSON.stringify(datasetArrayV2)});
	});
}

//isObjExisted(alertId, datasetArray)
function isObjExisted(alertId, datasetArray){
	for(var i = 0; i < datasetArray.length; i++){
		if(alertId === datasetArray[i].alertId){
			return datasetArray[i];
		}	
	}
	return false;
}

//******************v2 end***********************************


//*****************v1 start*******************************

function getDataAndPassToFronEndV1(req , res){
	
	dao.selectAllAlertsMateData(function(rows){
		for(var i = 0; i < rows.length; i++){
			var jsonObj = {alertId : rows[i].ALERT_ID, alertData : [], matedata : getMatedata(rows[i])};
			datasetArray.push(jsonObj);
		}
		console.log(rows);
		
		getAlertDataV1(res);
	});
}

function getAlertDataV1(response){
	var alerdata = [];
	dao.queryAllAlertData(function(rows){
		//console.log(rows);
		//if(!rows) throw new Error("no data");
		
		for(var i = 0; i < rows.length; i++){
			var obj = getObj(rows[i].ALERT_ID);
			if( obj !== "notfound"){
				obj.alertData.push(extractData(rows[i]));	
			}		
		}
		
		var d = datasetArray;
		console.log(JSON.stringify(datasetArray));
		cleanArray();
		timeEnd = new Date().getMilliseconds();
		console.log("method two take : " + (timeEnd - timeStart));
		response.render('index1', { title: 'Express', datasets:JSON.stringify(d)});
		
	});
}

function getObj(alertId){
	for(var i = 0; i < datasetArray.length; i++)
		if(datasetArray[i].alertId === alertId) return datasetArray[i];
	
	return "notfound";
}



//***********************v1 end*********************************************

function getDataAndPassToFronEnd(req , res){
	dao.selectAlertIdV1(function(rows){
		alertIdArray = getSortedAlertIdArray(rows);
		var temp = alertIdArray.shift();
		getAlertData(res , temp);	
	});
}

function getAlertData(response, alertId){
	if(alertId){
		dao.queryAlertDataByAlertIdV1(alertId,function(rows){
			var alertData = parse2JSON(alertId, rows);	
			datasetArray.push(alertData);	
			return getAlertData(response,alertIdArray.shift());
		});
	}else{
		var d = datasetArray;
		cleanArray();
		timeEnd = new Date().getMilliseconds();
		console.log("method one take : " + (timeEnd - timeStart));
		response.render('index1', { title: 'Express', datasets:JSON.stringify(d)});
	}
}

//get raw data sorted in DB  
function getSortedAlertIdArray(dbRows){
	var array = [];
	for(var i in dbRows){
		array.push(dbRows[i].ALERT_ID);
	}
	// sort algorithms 
	sortByAlertId(array);
	
	return array;
}

function extractData(row){
	var temp = {};
	temp.alertTime  = row.ALERT_TIME;
	temp.alertValue = row.ALERT_VALUE;
	temp.alertType  = row.ALERT_TYPE;
    return temp;
}

// get data from mysql , then parse them to JSON format data
function parse2JSON(alertId, dbRows){
	var data = {alertId : alertId, alertData:[], matedata : {}};
	data.matedata = getMatedata(dbRows[0]);
    for (var i in dbRows) {
    	var temp = {};
    	temp.alertTime = dbRows[i].ALERT_TIME;
    	temp.alertValue = dbRows[i].ALERT_VALUE;
    	temp.alertType = dbRows[i].ALERT_TYPE;
    	data.alertData.push(temp);
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



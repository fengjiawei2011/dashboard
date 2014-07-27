var util = require('util');
var dao = require('../dao');
var spreadsheet=require('node_spreadsheet');
var fs = require('fs');
var matedata = [];

exports.upload = function( req , res){

	//res.send('500 ok');
	res.render('upload');
};

exports.datafile = function(req , res){
	console.log('uploading data file');
	var oriPath = req.files.file.path;
	var newPath = __dirname+"/../files/upload";
	rename(oriPath, newPath, function(){
		uploadData(newPath, function(result){
			console.log("data upload result = " + result );
			res.redirect("/");
		});
	});
	
};


exports.matedatafile = function(req , res){
	console.log('uploading matedata file');
	var oriPath = req.files.file.path;
	var newPath = __dirname+"/../files/upload";
	rename(oriPath, newPath, function(){
		uploadMatedata(newPath, function(result){
			console.log("matedata upload result = " + result );
			res.redirect("/");
		});
	});
	
};

function getFileContent(){


}

// save the file into new path
function rename(oldPath, newPath, next){
	fs.rename(oldPath , newPath, function(err){
		if(err){
			util.debug("rename() error!");
			throw err;
		}
		console.log("upload file success");
		next();
	});
		
}

//function isExist(data){
//	for( var i = 0 ; i < matedata.length; i++){
//		if(matedata[i]['ALERT_ID'] === data['ALERT_ID']) return true;
//	}
//	return false;
//}

function isExist(data){
	for( var i = 0 ; i < matedata.length; i++){
		if(matedata[i] == data) return true;
	}
	
	return false;
}


/*read data from .xls*/
function uploadData(path, callback){
	var inputFile = path;
	
	console.log("reading file...");
	spreadsheet.read(inputFile, function(err, data) {
		if(err) console.log(err);    
		for(var i in data){
			/* insert data from .xlsx to mysql*/
			if(data[i][0] === "ALERT_ID" || data[i][0] ==="") continue;
			
			if (parseInt(data[i][2]) >= 0 && data[i][0].toLowerCase().indexOf("test") == -1) {
				var timeSpot = new Date(data[i][1]);
				var timeLimit = new Date("2015-01-01 ");
				if(timeSpot < timeLimit){
					var row = {
							ALERT_ID:data[i][0], 
							ALERT_TIME:new Date(data[i][1]), 
							ALERT_VALUE:data[i][2], 
							ALERT_TYPE:data[i][3]
						};
					console.log(row);
					dao.insertLastestData(row);
				}
			}
		} 
		
		callback("success");
	});
}

// not working so far
function isExistedInDB(id, next){
	
	dao.getMetadata(id, function(row){
		
		if(id){
			if( row.length === 0)
				next();
			else return isExistedInDB(uploadData.shift(), next);
		}
//		if(row.length !== 0 ){
//			util.debug(id + "   exist!!");
//			console.log(row);
//			
//		}
		
	})
}

function uploadMatedata(path, callback){
	var inputFile = path;
	spreadsheet.read(inputFile, function(err, data) {
		if(err) console.log(err); 
		for(var i in data){
			
			if(data[i][0] === "ALERT_ID_1" || data[i][0] ==="") continue;
			
			if(!isExist(data[i][0])){
				matedata.push(data[i][0]);
				var row = {
						ALERT_ID       : data[i][0],
						ALERT_NAME     : data[i][1],
						QUERY_INFO     : data[i][2],
						FREQUENCY      : data[i][3],
						THRESHOLD_VALUE: data[i][4],
						WARNING_START  : data[i][7],
						WARNING_END    : data[i][8],
						ALERT_START    : data[i][9],
						ALERT_END      : data[i][10] > 999999 ? 999999: data[i][10],
						ALERT_FLAG     : data[i][5],
						MAIL_LIST      : data[i][6],
						TASK_TYPE      : data[i][13]
				};
				//console.log(row);
				dao.insertMateData(row);
			}
		} 
			
		callback("success");
		
//		data.forEach(function(row){
//			//console.log(JSON.stringify(row));
//			var id = row[4];
//			if(id === "ALERT_ID" || id ==="") return;
//			
//			if (parseInt(row[2]) >= 0 && id.toLowerCase().indexOf("test") == -1) {
//				
//				isExistedInDB(id, function(){
//					var r = {
//							ALERT_ID       : id,
//							ALERT_NAME     : row[5],
//							QUERY_INFO     : row[6],
//							FREQUENCY      : row[7],
//							THRESHOLD_VALUE: row[8],
//							WARNING_START  : row[11],
//							WARNING_END    : row[12],
//							ALERT_START    : row[13],
//							ALERT_END      : row[14] > 999999 ? 999999: row[14],
//							ALERT_FLAG     : row[9],
//							MAIL_LIST      : row[10],
//							TASK_TYPE      : row[17]
//					};
//					//console.log("add----" + JSON.stringify(r));
//					dao.insertMateData(r);
//				});
//			}
//		});
		
	});
}

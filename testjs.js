/**
 * New node file
 */


function parse2FlotDatasetFormat(id, callback){
	console.log("ori_id= "+ id);
	setTimeout(function(){callback(id*2);}, 1000);
}


var ids = [1,2,3,4,5,6];
var results = [];
function getDataByAlertId(id){
	if(id){
		parse2FlotDatasetFormat(id,function(data){
			console.log("After_di= " + data);
			results.push(data);
			return getDataByAlertId(ids.shift());
		});		
	}else{
		console.log("done",results);
	}
}

getDataByAlertId(ids.shift())
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


function JSONTest(){
	var obj = {
		"Frank" : "Feng",
		toJSON: function(){
			return "Jiawei";
		}
	};
	
	console.log(JSON.stringify({"x":obj}));
}


var person = {
	    firstName : "John",
	    lastName  : "Doe",
	    age       : 50,
	    eyeColor  : "blue",
	    abc       : function(){
	    	console.log("good");
	    }
	};

	
	console.log(JSON.stringify(person));
	person.abc();
//JSONTest();
//getDataByAlertId(ids.shift())
//var d = new Date("2014/2/09");
//var d1 = new Date(d.getTime());

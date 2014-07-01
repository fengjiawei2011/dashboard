/**
 * New node file
 */


function Hello(){
	var name;
	this.setName = function(aa){
		name = aa;
	};
	this.sayHello = function() {
		console.log("hello" + name);
	};
}

module.exports = Hello;
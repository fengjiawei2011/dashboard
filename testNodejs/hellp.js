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

var d = new Date('2014-04-01T16:52:42.000Z');

console.log(d.toLocaleDateString());
console.log(d.toDateString());
console.log(d.toLocaleTimeString());
console.log(d.toTimeString());
console.log(d.toLocaleString());
console.log(d.toUTCString()); 
console.log(d.toString());
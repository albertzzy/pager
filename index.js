var pathToRegexp = require('path-to-regexp');


var onclickHandler = function(e){

}

var isHistorySupport = !!window.history;
var location  = window.location;

function PageContext(){
	var indexOfHash = location.href.indexOf('#');
	this.url = indexOfHash>-1? location.hash.substr(indexOfHash):location.pathname;

}


/*
	var p = new Pager()
	p.route(path,fn)
	p.redirect(pathfrom,pathto)
	p.show(path)
	
*/

function Pager(){
	this.routes = [];

	this.ctx = new PageContext();

}

/*
	mount a route
*/

Pager.prototype.route = function(path,fn){
	
}


/*
	redirect(path)
	redirect(path1,path2)
*/
Pager.prototype.redirect = function(pathfrom,pathto){
	
}

Pager.prototype.show = function(path){

}







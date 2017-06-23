// var pathToRegexp = require('path-to-regexp');


var isHistoryStateSupport = 'onpopstate' in window;
var location  = window.location;
var sessionStorage = window.sessionStorage;
var clickEvent = document.ontouchstart ? 'touchstart' : 'click';
var uid = 0;



var onclickHandler = function(e){

}

var popstateHandler = function(){

}

var hashchangeHandler = function(){

}



function PageContext(){
	var indexOfHash = location.href.indexOf('#');

	this.title = document.title;

	this.host = location.host;

	this.url = indexOfHash>-1? location.hash.substr(indexOfHash):location.pathname;

	if(!isHistoryStateSupport){
		this.history = [];
	}

	this.updateState();
}

PageContext.prototype.updateState = function(){
	var indexOfHash = location.href.indexOf('#');
	this.url = indexOfHash>-1? location.hash.substr(indexOfHash):location.pathname;

	if(isHistoryStateSupport){
		this.state = window.history.state;

	}else{
		this.state = {
			url:this.url,
			title:this.title
		}

	}

}


PageContext.prototype.save = function(){
	if(isHistoryStateSupport){
		window.history.pushState(this.state,this.title,this.url);

	}else{
		this.history.push(this.state);
	}	

}

PageContext.prototype.replace = function(){
	if(isHistoryStateSupport){
		window.history.replaceState(this.state,this.title,this.url);

	}else{
		if(this.history.length>0){
			this.history.splice(-1,1);

		}
		this.history.push(this.state);
	}	
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

	this.start();

}


Pager.prototype.start = function(){
	document.addEventListener(clickEvent,clickHandler,false);

	document.addEventListener('onpopstate',popstateHandler,false);

	document.addEventListener('hashchange',hashchangeHandler,false);

}



/*
	mount a route
*/
Pager.prototype.mount = function(type,path,fn){

	if(typeof path === 'function'){
		this.routes['enter'].push({
			url:'*',
			cbs:[].slice.call(null,arguments).filter(function(e){return typeof e === 'function'})
		})

	}else{	
		if(typeof type === 'string'){
			if(typeof path === 'string'){
				this.routes[type].push({
					url:path,
					cbs:typeof fn === 'array' ? fn : [fn]
				})

			}else{
				throw new Error('typeof second arg expeced to  be array');
			}

		}else{
			throw new Error('some arg(s) is/are wrong.')

		}

	}
}


Pager.prototype.unmount = function(path){
	var typeArr = ['enter','leave'];

	if(typeof path !== 'string'){
		throw new Error('arg u give expected to be string');
	}

	for(var j=0;j<typeArr.length;j++){
		var type = typeArr[j];

		for(var i=0;i<this.routes[type].length;i++){
			var route = this.routes[type][i];
			if(route.url===path){
				this.routes[type].splice(i,1);
			}
		}
	}

}

/*
	redirect(path) //replace
	redirect(path1,path2)
*/
Pager.prototype.redirect = function(pathfrom,pathto){
	if(arguments.length===1){
		this.enter(pathfrom,false);

	}else if(arguments.length === 2){
		this.leave(pathfrom);
		this.enter(pathto);

	}else{
		throw new Error('redirect args wrong.');

	}

}

/*	
 enter /leave(path) //save
*/
['enter','leave'].forEach(function(type){
	Pager.prototype[type] = function(path,isSave){
		if(typeof path !== 'string'){
			throw new Error('arg should be string.');
		}


		if(type === 'enter'){
			this.ctx.updateState();

			if(isSave){
				this.ctx.save();
			}else{
				this.ctx.replace();
			}
			
		}

		for(var i=0;i<this.routes[type].length;i++){
			var route = this.routes[type][i];

			if(route.url!==path){
				continue;

			}else{
				setTimeout(function(){
					for(var j=0;j<route.cbs.length;j++){
						var cb = route.cbs[j];
						if(typeof cb === 'function'){
							cb()
						}
					}
				},0)

			}
		}
	}

})







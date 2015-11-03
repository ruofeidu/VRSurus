'use strict';
var game = {
	started		:	false,
	tutorial	:	false,
	startTime	:	0,
	totalTime	:	120,
	timeLeft	:	120,
}

game.start = function() {
	game.startTime	= 	+new Date(); 
	game.timeLeft 	=	game.totalTime; 
	garbage.build(); 
	setTimeout(function(){ peasant.buildInFront() }, 3000);
	setTimeout(function(){ factory.buildInFront() }, 6000);
}

game.update = function() {
	if (!game.started) return; 
	var curTime = +new Date(); 
	game.timeLeft = game.totalTime - Math.floor( (curTime - game.startTime) / 1000 ); 
}

game.over = function() {
	factory.hide();
	peasant.hide(); 
	garbage.hideAll(); 
}
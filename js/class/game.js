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
}

game.update = function() {
	if (!game.started) return; 
	var curTime = +new Date(); 
	game.timeLeft = game.totalTime - Math.floor( (curTime - game.startTime) / 1000 ); 
}
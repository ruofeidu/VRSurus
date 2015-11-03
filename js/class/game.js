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
	setTimeout(function(){ peasant.buildInFront() }, Paras.peasant.initTime);
	setTimeout(function(){ factory.buildInFront() }, Paras.factory.initTime);
	audio.bgm.play(); 
	game.started = true; 
}

game.update = function() {
	if (!game.started) return; 
	var curTime = +new Date(); 
	game.timeLeft = game.totalTime - Math.floor( (curTime - game.startTime) / 1000 ); 
	if (game.timeLeft <= 0) {
		game.over();
	}
}

game.over = function() {
	game.started = false; 
	factory.hide();
	peasant.hide(); 
	garbage.hideAll(); 
}

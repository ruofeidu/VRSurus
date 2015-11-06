'use strict';
var game = {
	started		:	false,
	tutorial	:	false,
	godmode		:	false,
	startTime	:	0,
	totalTime	:	63,
	timeLeft	:	63,
	tutorialStep : -1,
}

game.tutorial = function() {
	if (game.tutorialStep == -1) {
		game.tutorialStep = 0; 
		garbage.buildInFront(); 
	} else
	if (game.tutorialStep == 0) {
		game.tutorialStep = 1; 
		peasant.buildInFront(); 
	} else 
	if (game.tutorialStep == 1) {
		game.tutorialStep = 2; 
		factory.buildInFront(); 
	} else {
		game.tutorialStep = -1; 
		game.start(); 
	}
}

game.start = function() {
	game.tutorialStep = -1; 
	game.startTime	= 	+new Date(); 
	game.timeLeft 	=	game.totalTime;
	setTimeout(function(){ garbage.build(); }, Paras.garbage.initTime);
	setTimeout(function(){ peasant.buildInFront() }, Paras.peasant.initTime);
	setTimeout(function(){ factory.buildInFront() }, Paras.factory.initTime);
	audio.bgm.play(); 
	game.started = true; 
	surus.initPosition(); 
	surus.cheering = false; 
	surus.curState = SURUS_IDLE; 
	score.mesh.visible = false; 
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
	
	surus.cheer(); 
	score.show(); 
}

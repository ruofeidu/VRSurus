'use strict';

Mousetrap.bind('1', function() { 
	signalSlapLeft(); 
}, 'keydown');

Mousetrap.bind('2', function() { 
	signalSlapRight(); 
}, 'keydown');

Mousetrap.bind('3', function() { 
	signalSpray();
}, 'keydown');

Mousetrap.bind('4', function() { 
	signalThrust(); 
}, 'keydown');

Mousetrap.bind('6', function() { 
	factory.buildInFront(); 
}, 'keydown')

Mousetrap.bind('7', function() { 
	peasant.buildInFront(); 
}, 'keydown')

Mousetrap.bind('8', function() { 
	garbage.build(); 
}, 'keydown')

Mousetrap.bind('a', function() { 
	surus.leftwards(); 
}, 'keydown');

Mousetrap.bind('d', function() { 
	surus.rightwards(); 
}, 'keydown');

Mousetrap.bind('space', function() { 
	game.tutorial(); 
}, 'keydown');

Mousetrap.bind('enter', function() { 
	game.start(); 
}, 'keydown');

Mousetrap.bind('shift+enter', function() { 
	signals.lock = false;
}, 'keydown');


Mousetrap.bind('shift+space', function() { 
	game.over(); 
}, 'keydown');

Mousetrap.bind('shift+g', function() { 
	game.godmode = !game.godmode; 
}, 'keydown');

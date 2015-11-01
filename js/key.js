Mousetrap.bind('1', function() { 
	if (surus.curState !== SURUS_SLAP_LEFT)	surus.slapLeft(); 
}, 'keydown');

Mousetrap.bind('2', function() { 
	if (surus.curState !== SURUS_SLAP_RIGHT) surus.slapRight(); 
}, 'keydown');

Mousetrap.bind('3', function() { 
	if (surus.curState !== SURUS_SPRAY) surus.spray(); 
}, 'keydown');

Mousetrap.bind('4', function() { 
	if (surus.curState !== SURUS_THRUST) surus.thrust(); 
}, 'keydown');

Mousetrap.bind('5', function() { 
	surus.thrust(); 
}, 'keydown');

Mousetrap.bind('space', function() { 
	audio.howl.play(); 
}, 'keydown');

Mousetrap.bind('shift+1', function() { 
	audio.sew.play(); 
}, 'keydown');


Mousetrap.bind('shift+2', function() { 
	audio.sew2.play(); 
}, 'keydown');

Mousetrap.bind('a', function() { 
	surus.leftwards(); 
}, 'keydown');

Mousetrap.bind('d', function() { 
	surus.rightwards(); 
}, 'keydown');

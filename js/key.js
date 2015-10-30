Mousetrap.bind('1', function() { 
	surus.attack(); 
}, 'keydown');

Mousetrap.bind('2', function() { 
	surus.idle(); 
}, 'keydown');

Mousetrap.bind('3', function() { 
	surus.roar(); 
}, 'keydown');

Mousetrap.bind('space', function() { 
	surus.howl.play(); 
}, 'keydown');

Mousetrap.bind('shift+1', function() { 
	surus.sew.play(); 
}, 'keydown');


Mousetrap.bind('shift+2', function() { 
	surus.sew2.play(); 
}, 'keydown');


Mousetrap.bind('shift+2', function() { 
	surus.sew2.play(); 
}, 'keydown');

Mousetrap.bind('a', function() { 
	surus.leftwards(); 
}, 'keydown');

Mousetrap.bind('d', function() { 
	surus.rightwards(); 
}, 'keydown');

Mousetrap.bind('1', function() { 
	surus.attack(); 
}, 'keydown');

Mousetrap.bind('2', function() { 
	surus.idle(); 
}, 'keydown');

Mousetrap.bind('space', function() { 
	surus.howl.play(); 
}, 'keydown');

Mousetrap.bind('s', function() { 
	surus.sew.play(); 
}, 'keydown');


Mousetrap.bind('d', function() { 
	surus.sew2.play(); 
}, 'keydown');

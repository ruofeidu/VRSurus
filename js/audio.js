'use strict';

// camera -> audio
function initAudio() {
	var listener = new THREE.AudioListener();
	camera.add( listener );
	
	audio.bgm = new THREE.Audio( listener ); 
	audio.bgm.load( 'sounds/bgm.ogg' ); 
	audio.bgm.setRefDistance( 1000 ); 
	
	audio.axe = new THREE.Audio( listener ); 
	audio.axe.load( 'sounds/axe.ogg' ); 
	audio.axe.setRefDistance( 200 ); 
	audio.axe.setVolume(0.3); 
	audio.axe.setLoop(true); 
	
	audio.factory = new THREE.Audio( listener ); 
	audio.factory.load( 'sounds/factory.ogg' ); 
	audio.factory.setRefDistance( 200 ); 
	audio.factory.setVolume(0.8); 
	audio.factory.setLoop(true); 
	
	audio.die = new THREE.Audio( listener ); 
	audio.die.load( 'sounds/die.ogg' ); 
	audio.die.setRefDistance( 200 ); 
	audio.die.setVolume(0.5); 
	
	audio.explode = new THREE.Audio( listener ); 
	audio.explode.load( 'sounds/explode.ogg' ); 
	audio.explode.setRefDistance( 200 ); 
	
	audio.howl = new THREE.Audio( listener );
	audio.howl.load( 'sounds/howl.ogg' );
	audio.howl.setRefDistance( 100 );
	
	/*
	audio.sew = new THREE.Audio( listener );
	audio.sew.load( 'sounds/sew.ogg' );
	audio.sew.setRefDistance( 50 );
	
	audio.sew2 = new THREE.Audio( listener );
	audio.sew2.load( 'sounds/sew.ogg' );
	audio.sew2.setRefDistance( -50 );
	*/
}
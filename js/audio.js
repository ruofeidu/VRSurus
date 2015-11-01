'use strict';

// camera -> audio
function initAudio() {
	var listener = new THREE.AudioListener();
	camera.add( listener );
	audio.howl = new THREE.Audio( listener );
	audio.howl.load( 'sounds/howl.ogg' );
	audio.howl.setRefDistance( 100 );
	surus.get().add(audio.howl); 
	
	audio.sew = new THREE.Audio( listener );
	audio.sew.load( 'sounds/sew.ogg' );
	audio.sew.setRefDistance( 50 );
	
	audio.sew2 = new THREE.Audio( listener );
	audio.sew2.load( 'sounds/sew.ogg' );
	audio.sew2.setRefDistance( -50 );
}
'use strict';

// camera -> audio
function initAudio() {
	var listener = new THREE.AudioListener();
	camera.add( listener );
	surus.howl = new THREE.Audio( listener );
	surus.howl.load( 'sounds/howl.ogg' );
	surus.howl.setRefDistance( 100 );
	surus.get().add(surus.howl); 
	
	surus.sew = new THREE.Audio( listener );
	surus.sew.load( 'sounds/sew.ogg' );
	surus.sew.setRefDistance( 50 );
	
	surus.sew2 = new THREE.Audio( listener );
	surus.sew2.load( 'sounds/sew.ogg' );
	surus.sew2.setRefDistance( -50 );
}
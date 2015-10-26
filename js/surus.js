'use strict';

function initSurus() {
	surus = new THREE.SEA3D({
		autoPlay : false, 	// Auto play animations
		container : scene	// Container to add models
	});
	
	surus.ready = false; 
	
	surus.get = function() {
		return surus.getMesh( Paras.surus.meshName ); 
	}
	
	surus.idle = function() {
		var s = 'idle' + (~~(Math.random() * 3));
		surus.get().play(s, Paras.surus.crossFade); 
	}
	
	surus.attack = function() {
		var s = 'attack' + (~~(Math.random() * 2));
		surus.get().play(s, Paras.surus.crossFade); 	
	}

	surus.onComplete = function( e ) {
		surus.ready = true; 
		controls = new THREE.OrbitControls( camera );
		initAudio(); 
		animate();
	};

	surus.load( Paras.surus.fileName );
}

'use strict';

function initPeasant() {
	peasant = new THREE.SEA3D({
		autoPlay : false, 	// Auto play animations
		container : scene	// Container to add models
	});
	
	peasant.onComplete = function( e ) {
		peasant.ready = true; 
		animate(); 
	};
	
	peasant.load( Paras.peasant.fileName );
}
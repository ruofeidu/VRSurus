'use strict';

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	var delta = clock.getDelta();
	requestAnimationFrame( animate );
	// Update SEA3D Animations
	THREE.SEA3D.AnimationHandler.update( delta );
	// Update Three.JS Animations
	THREE.AnimationHandler.update( delta );
	render( delta );
	stats.update();
}

function render( dlt ) {
	renderer.render( scene, camera );
	//composer.render( dlt );
}
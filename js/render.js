'use strict';

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	cameraOrtho.left = - window.innerWidth / 2;
	cameraOrtho.right = window.innerWidth / 2;
	cameraOrtho.top = window.innerHeight / 2;
	cameraOrtho.bottom = - window.innerHeight / 2;
	cameraOrtho.updateProjectionMatrix();
	score.updateHUD(); 
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	if (vvr.effect) vvr.effect.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	var delta = clock.getDelta();
	requestAnimationFrame( animate );
	THREE.SEA3D.AnimationHandler.update( delta );	// Update SEA3D Animations
	THREE.AnimationHandler.update( delta );			// Update Three.JS Animations
	
	updateSignals(); 

	if (water.sys) water.update(delta); 
	if (fire.sys) fire.update(delta); 
	if (wind.sys2) wind.update(delta); 
	starsUpdate(); 
	game.update(); 
	render( delta );
	
	if (Paras.debugMode) stats.update();
}

function render( delta ) {
	//if (vvr.isEnabled()) {
	if (vvr.controls) {
		vvr.controls.update();
		surus.syncCamera(); 
		if (camera.position.x > 8.0) camera.position.x = 8.0; 
		camera.translateY(Paras.camera.posY); 
		camera.translateZ(Paras.camera.posZ); 
		camera.translateX(Paras.camera.posX); 
	}
	renderer.clear();
	if (vvr.isEnabled()) {
		vvr.effect.render(scene, camera, sceneOrtho, cameraOrtho);
	} else {
		vvr.effect.render(scene, camera, sceneOrtho, cameraOrtho); 
	}
	
}

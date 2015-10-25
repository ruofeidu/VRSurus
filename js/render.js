'use strict';

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	if (vvr.effect) vvr.effect.setSize(window.innerWidth, window.innerHeight);
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

function render( delta ) {
	//if (vvr.isEnabled()) {
	if (vvr.controls) {
		vvr.controls.update();
		camera.translateY(Paras.camera.posY); 
		camera.translateZ(Paras.camera.posZ); 
		camera.translateX(Paras.camera.posX); 
	}
	
	
	surus.get().position.set(Paras.surus.posX, Paras.surus.posY, Paras.surus.posZ); 
	
	if (vvr.isEnabled()) {
		vvr.effect.render(scene, camera);
	} else {
		vvr.effect.render(scene, camera);
		//renderer.render(scene, camera);
	}
	
	/*
	if (vvr.inited && vvr.isEnabled()) {
		controls.update();
		vvr.effect.render(scene, camera);
	} 
	else {
		renderer.render(scene, camera);
	}
	*/
}

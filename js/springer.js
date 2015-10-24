function initSpringer() {
	springer = new THREE.SEA3D({
		autoPlay : false, 	// Auto play animations
		container : scene	// Container to add models
	});
	
	springer.ready = false; 
	
	springer.get = function() {
		return springer.getMesh( Paras.springer.meshName ); 
	}
	
	springer.idle = function() {
		var s = 'idle' + (~~(Math.random() * 3));
		springer.get().play(s, Paras.springer.crossFade); 
	}
	
	springer.attack = function() {
		var s = 'attack' + (~~(Math.random() * 2));
		springer.get().play(s, Paras.springer.crossFade); 	
	}

	springer.onComplete = function( e ) {
		springer.ready = true; 
		controls = new THREE.OrbitControls( camera );
		springer.get().position.set(0.0, Paras.springer.posY, 0.0); 
		animate();
	};

	springer.load( Paras.springer.fileName );
}

'use strict';
function initPeasant() {
	peasant = new THREE.SEA3D({
		autoPlay : false, 	// Auto play animations
		container : scene	// Container to add models
	});
	
	peasant.ready = false; 
	peasant.isBuilding = false; 
	peasant.isWorking = false; 
	peasant.isDestroyed = false; 
	peasant.radius = 0.0; 
	peasant.degree = 0.0; 
	peasant.initPos = []; 
	
	peasant.build = function(R, theta) {
		peasant.radius = R; 
		peasant.degree = theta; 
		peasant.isBuilding = true; 
		peasant.isWorking = true; 
		peasant.isDestroyed = false; 
		for (var i = 0; i < peasant.meshes.length; i++) {
			if (peasant.meshes[i].position) {
				peasant.meshes[i].position.copy(peasant.initPos[i]); 
			}
		}		
		for (var i = 0; i < peasant.meshes.length; i++) {
			if (peasant.meshes[i].position) {
				peasant.meshes[i].position.multiplyScalar ( 20 ); 
				peasant.meshes[i].translateX(R * Math.cos(theta)); 
				peasant.meshes[i].translateY(10.0); 
				peasant.meshes[i].translateZ(R * Math.sin(theta)); 
				peasant.meshes[i].scale.set(20, 20, 20); 
			}
		}
		peasant.work();
	}
	
	peasant.work = function() {
		peasant.isBuilding = false; 
		peasant.isWorking = true; 
		peasant.isDestroyed = false; 
		for (var i = 0; i < peasant.meshes.length; i++) {
			if (peasant.meshes[i].animations[1]) {
				peasant.meshes[i].animations[1].timeScale = 1.0;
				peasant.meshes[i].animations[1].play();
			}
		}
	}
	
	peasant.onComplete = function( e ) {
		for (var i = 0; i < peasant.meshes.length; i++) {
			var vec = new THREE.Vector3(); 
			vec.copy(peasant.meshes[i].position); 
			peasant.initPos.push( vec );
		}
		console.log( "peasant loading:", peasant.file.timer.elapsedTime + "ms" );
		checkLoading(); 
	};
	
	peasant.load( Paras.peasant.fileName );
}

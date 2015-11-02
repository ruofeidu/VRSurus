'use strict';
function initGarbage() {
	for (var i = 0; i < Paras.garbage.count; ++i) {
		garbage.push( new THREE.SEA3D({
			autoPlay : false, 	// Auto play animations
			container : scene	// Container to add models
		}); );
		garbage[i].onComplete = function( e ) {
			checkLoading(); 
			console.log( "garbage" + i + " loading:", garbage.file.timer.elapsedTime + "ms" );
		};
	}
	
	garbage.build = function() {
		garbage[i].isDestroyed = false; 
		for (var i = 0; i < garbage.meshes.length; i++) {
			R = Math.Random() * 50 + 50; 
			theta = Math.Random() * Math.PI * 2; 
			
			garbage[i].radius = R; 
			garbage[i].degree = theta; 
			if (garbage.meshes[i].position) {
				garbage.meshes[i].position.set(R * Math.cos(theta), -45, R * Math.sin(theta) ); 
				garbage.meshes[i].scale.set(5, 5, 5);
			}				
		}
	}
	
	
	for (var i = 0; i < Paras.garbage.count; ++i) {
		garbage[i].load( Paras.garbage.fileNames[i] ); 
	}
}

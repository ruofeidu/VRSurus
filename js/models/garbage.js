'use strict';
function initGarbage() {
	for (var i = 0; i < Paras.garbage.count; ++i) {
		garbage.push( new THREE.SEA3D({
			autoPlay : false, 	// Auto play animations
			container : scene	// Container to add models
		}) );
		garbage[i].onComplete = function( e ) {
			checkLoading(); 
		};
		garbage[i].isDestroyed = false;
		garbage[i].sid = 2 + i; 
	}
	
	garbage.buildInFront = function() {
		var R = 150; 
		var theta = surus.getOrientation();
		
		var i = 0; 
		garbage[i].isDestroyed = false;
		garbage[i].radius = R; 
		garbage[i].degree = theta; 
		garbage[i].meshes[0].position.set(R * Math.cos(theta), 10, R * Math.sin(theta) ); 
		garbage[i].meshes[0].scale.set(2, 2, 2);	
		garbage[i].meshes[0].visible = true; 
	}
	
	garbage.build = function() { 
		for (var i = 0; i < Paras.garbage.count; ++i) {
			var R = Math.random() * 100 + 100; 
			var theta = Math.random() * Math.PI * 2; 
			
			garbage[i].isDestroyed = false;
			garbage[i].radius = R; 
			garbage[i].degree = theta; 
			garbage[i].meshes[0].position.set(R * Math.cos(theta), 10, R * Math.sin(theta) ); 
			garbage[i].meshes[0].scale.set(2, 2, 2);	
			garbage[i].meshes[0].visible = true; 
		}
	}
	
	garbage.numAlive = function() {
		var ans = 0; 
		for (var i = 0; i < Paras.garbage.count; ++i) if (!garbage[i].isDestroyed) {
			++ans; 
		}
		return ans; 
	}
	
	garbage.vanish = function(i) {
		garbage[i].meshes[0].visible = false; 
		if (garbage.numAlive() <= Paras.garbage.spawnLeft) {
			setTimeout(function(){ garbage.build(); }, Paras.garbage.spawnTime);
		}
	}
	
	garbage.hideAll = function() {
		for (var i = 0; i < Paras.garbage.count; ++i) {
			garbage[i].meshes[0].visible = false; 
		}
	}
	
	garbage.die = function(i) {
		garbage[i].isDestroyed = true; 
		setTimeout(function(){ starBlink(1+i, garbage[i].meshes[0].position); garbage.vanish(i); }, Paras.garbage.dieTime);
	}
	
	
	for (var i = 0; i < Paras.garbage.count; ++i) {
		garbage[i].load( Paras.garbage.fileNames[i] ); 
	}
}

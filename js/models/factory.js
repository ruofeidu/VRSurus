'use strict';
function initFactory() {
	factory = new THREE.SEA3D({
		autoPlay : false, 	// Auto play animations
		container : scene	// Container to add models
	});
	
	factory.ready = false; 
	factory.isBuilding = false; 
	factory.isWorking = false; 
	factory.isDestroyed = false; 
	factory.radius = 0.0; 
	factory.degree = 0.0; 
	factory.sid = 0;
	
	/**
	 * Build a factory in the game.
	 */
	factory.build = function(R, theta, respawn) {
		if (R === undefined) R = Math.random() * 60 + 120;
		if (theta === undefined) theta = Math.random() * Math.PI * 2; 
		if (respawn === undefined) respawn = true; 
		factory.radius = R; 
		factory.degree = theta; 
		factory.isBuilding = true; 
		factory.isWorking = true; 
		factory.isDestroyed = false; 
		for (var i = 0; i < factory.meshes.length; i++) {
			if (factory.meshes[i]) {
				factory.meshes[i].position.set(R * Math.cos(theta), Paras.factory.height, R * Math.sin(theta) ); 
				factory.meshes[i].scale.set(Paras.factory.scale, Paras.factory.scale, Paras.factory.scale);
				factory.meshes[i].visible = true; 
			}				
		}
		
		for (var i = 0; i < factory.meshes.length; i++) {
			if (factory.meshes[i].animation) {
				factory.meshes[i].animation.timeScale = Paras.factory.buildSpeed;
				factory.meshes[i].animation.play("root");
			}
		}
		if (respawn) setTimeout(function(){ factory.work() }, Paras.factory.buildTime);
	}
	
	factory.buildInFront = function() {
		factory.build(150.0, surus.getOrientation(), false);
	}
	
	factory.hide = function() {
		if (audio.factory.isPlaying) audio.factory.stop(); 
		for (var i = 0; i < factory.meshes.length; i++) {
			if (factory.meshes[i]) {
				factory.meshes[i].visible = false; 
			}
		}
	}
	
	factory.vanish = function() {
		factory.hide(); 
		if (game.tutorialStep !== -1) setTimeout(function(){ factory.build(); }, Paras.factory.spawnTime);
	}
	
	factory.die = function() {
		factory.isDestroyed = true; 
		factory.isWorking = false; 
		if (!audio.explode.isPlaying) audio.explode.play(); 
		setTimeout(function(){ starBlink(0, factory.meshes[0].position); factory.vanish(); }, Paras.factory.dieTime);
		if (game.tutorialStep !== -1) game.tutorial();  
	}
	
	factory.work = function() {
		factory.isBuilding = false; 
		factory.isWorking = true; 
		factory.isDestroyed = false; 
		if (!audio.factory.isPlaying) audio.factory.play(); 
		for (var i = 0; i < factory.meshes.length; i++) {
			if (factory.meshes[i].animation) {
				factory.meshes[i].animation.timeScale = 1.0;
				factory.meshes[i].animation.play("work");
			}
		}
	}
	
	factory.onComplete = function( e ) {
		checkLoading(); 
		factory.meshes[0].add(audio.explode); 
		factory.meshes[1].add(audio.factory); 
		console.log( "factory loading:", factory.file.timer.elapsedTime + "ms" );
	};
	
	factory.load( Paras.factory.fileName );
}

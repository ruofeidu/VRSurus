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
		
	surus.injured = function() {
		surus.get().play('injured', Paras.surus.crossFade); 
	}
	
	surus.roar = function() {
		surus.get().play('roar', Paras.surus.crossFade); 
	}
	
	surus.swipe = function() {
		surus.get().play('attack0', Paras.surus.crossFade); 
	}
	
	surus.swipe2 = function() {
		surus.get().play('attack1', Paras.surus.crossFade); 
	}
	
	surus.yes = function() {
		surus.get().play('yes', Paras.surus.crossFade); 
	}
	
	surus.no = function() {
		surus.get().play('no', Paras.surus.crossFade); 
	}
	
	surus.run = function() {
		surus.get().play('run', Paras.surus.crossFade); 
	}
	
	surus.die = function() {
		surus.get().play('die', Paras.surus.crossFade); 
	}
	
	surus.turnLeft = function() {
		surus.get().play('turn_left', Paras.surus.crossFade); 
	}
	
	surus.turnRight = function() {
		surus.get().play('turn_left', Paras.surus.crossFade); 
	}
	
	surus.attack = function() {
		var s = 'attack' + (~~(Math.random() * 2));
		surus.get().play(s, Paras.surus.crossFade); 	
	}

	surus.onComplete = function( e ) {
		surus.ready = true; 
		controls = new THREE.OrbitControls( camera );
		surus.get().rotateOnAxis(new THREE.Vector3(0,1,0), -Math.PI);
		initAudio(); 
		animate();
	};
	
	surus.leftwards = function() {
		surus.get().rotateOnAxis(new THREE.Vector3(0,1,0), -Math.PI / 2 / 60 * 3);
	}
	
	surus.rightwards = function() {
		surus.get().rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI / 2 / 60 * 3);
	}

	surus.load( Paras.surus.fileName );
}

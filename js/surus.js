'use strict';
function initSurus() {
	surus = new THREE.SEA3D({
		autoPlay : false, 	// Auto play animations
		container : scene	// Container to add models
	});
	
	surus.ready = false; 
	surus.nosePos = new THREE.Vector3(); 
	
	surus.recState = SURUS_IDLE; 
	surus.curState = SURUS_IDLE; 
	
	surus.get = function() {
		return surus.getMesh( Paras.surus.meshName ); 
	}
	
	surus.getOrientation = function() {
		return -surus.get().rotation.y + Paras.camera.theta;
	}
	
	surus.idle = function() {
		surus.curState = SURUS_IDLE; 
		var s = 'idle' + (~~(Math.random() * 3));
		surus.get().play(s, Paras.surus.crossFade); 
	}
	
	surus.slapLeft = function() {
		surus.curState = SURUS_SLAP_LEFT; 
		surus.get().play('attack0', Paras.surus.crossFade); 
		setTimeout(function(){ surus.idle(); }, 1200);
	}
	
	surus.slapRight = function() {
		surus.curState = SURUS_SLAP_RIGHT; 
		surus.get().play('attack2', Paras.surus.crossFade); 
		setTimeout(function(){ surus.idle(); }, 1500);
	}
	
	surus.spray = function() {
		surus.curState = SURUS_SPRAY; 
		surus.get().play('roar', Paras.surus.crossFade); 
		setTimeout(function(){ surus.idle(); }, 1200 * 2);
	}
	
	surus.thrust = function() {
		surus.curState = SURUS_THRUST; 
		surus.get().play('run', Paras.surus.crossFade); 
		setTimeout(function(){ surus.idle(); }, 600 * 3);
	}
	
	surus.injured = function() {
		surus.get().play('injured', Paras.surus.crossFade); 
	}
	
	surus.swipe = function() {
		surus.get().play('attack0', Paras.surus.crossFade); 
	}
	
	surus.swipe2 = function() {
		surus.get().play('attack2', Paras.surus.crossFade); 
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
		surus.get().play('turn_right', Paras.surus.crossFade); 
	}
	
	surus.attack = function() {
		var s = 'attack' + (~~(Math.random() * 2));
		surus.get().play(s, Paras.surus.crossFade); 	
	}

	surus.onComplete = function( e ) {
		surus.ready = true; 
		controls = new THREE.OrbitControls( camera );
		surus.get().rotateOnAxis(new THREE.Vector3(0,1,0), Paras.surus.initRot);
		surus.get().position.set(Paras.surus.posX, Paras.surus.posY, Paras.surus.posZ); 
		initAudio(); 
		animate();
	};
	
	surus.leftwards = function() {
		surus.get().rotateOnAxis(new THREE.Vector3(0,1,0), -Math.PI / 2 / 60 * 3);
	}
	
	surus.rightwards = function() {
		surus.get().rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI / 2 / 60 * 3);
	}
	
	surus.syncCamera = function() {
		/*
		var lookAtVector = new THREE.Vector3(0,0, -1);
		lookAtVector.applyQuaternion(camera.quaternion);
		surus.get().rotation.y = lookAtVector.y; 
		*/
		
		surus.nosePos.setFromMatrixPosition(surus.get().skeleton.bones[27].matrixWorld);
		
		if (Math.abs(camera.rotation.y) >= Math.PI / 2 || ( Math.abs(camera.rotation.z) < Math.PI / 2 && Math.abs(camera.rotation.x) < Math.PI / 2 ) ) {
			surus.get().rotation.y = camera.rotation.y; 
		} else {
			//surus.get().rotation.y = camera.rotation.y; 
			if (camera.rotation.y > 0) {
				surus.get().rotation.y = Math.PI - camera.rotation.y;
			} else {
				surus.get().rotation.y = -Math.PI - camera.rotation.y; 
			}
		}
		
		/*
		var a = new THREE.Euler().setFromQuaternion( camera.quaternion, 'XYZ' );
		surus.get().rotation.y = a.y; 
		*/
	}

	surus.load( Paras.surus.fileName );
}

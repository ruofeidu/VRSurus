'use strict';
function initSurus() {
	surus = new THREE.SEA3D({
		autoPlay : false, 	// Auto play animations
		container : scene	// Container to add models
	});
	
	surus.ready = false; 
	surus.cheering = false; 
	surus.nosePos = new THREE.Vector3(); 
	surus.leftArmPos = new THREE.Vector3(); 
	surus.rightArmPos = new THREE.Vector3(); 
	surus.headPos = new THREE.Vector3(); 
	
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
	    if (!audio.wind.isPlaying) audio.wind.play(); 
		surus.get().play('attack0', Paras.surus.crossFade); 
		setTimeout(function(){ surus.idle(); }, 1200);
	}
	
	surus.slapRight = function() {
		surus.curState = SURUS_SLAP_RIGHT; 
	    if (!audio.wind.isPlaying) audio.wind.play(); 
		surus.get().play('attack2', Paras.surus.crossFade); 
		setTimeout(function(){ surus.idle(); }, 1500);
	}
	
	surus.spray = function() {
		surus.curState = SURUS_SPRAY; 
	    if (!audio.water.isPlaying) audio.water.play(); 
		surus.get().play('roar', Paras.surus.crossFade); 
		setTimeout(function(){ surus.idle(); }, 1200 * 2);
	}
	
	surus.thrust = function() {
		surus.curState = SURUS_THRUST; 
	    if (!audio.howl.isPlaying) audio.howl.play(); 
	    if (!audio.fire.isPlaying) audio.fire.play(); 
		surus.get().play('run', Paras.surus.crossFade); 
		setTimeout(function(){ surus.idle(); }, 2000);
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
	
	surus.initPosition = function() {
		surus.get().rotateOnAxis(new THREE.Vector3(0,1,0), Paras.surus.initRot);
		surus.get().position.set(Paras.surus.posX, Paras.surus.posY, Paras.surus.posZ); 
	}

	surus.onComplete = function( e ) {
		checkLoading(); 
		surus.ready = true; 
		console.log( "surus loading:", surus.file.timer.elapsedTime + "ms" );
		surus.initPosition(); 
		surus.get().add(audio.howl); 
		surus.get().add(audio.fire); 
		surus.get().add(audio.water); 
		surus.get().add(audio.wind); 
	};
	
	surus.leftwards = function() {
		surus.get().rotateOnAxis(new THREE.Vector3(0,1,0), -Math.PI / 2 / 60 * 3);
	}
	
	surus.rightwards = function() {
		surus.get().rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI / 2 / 60 * 3);
	}
	
	surus.checkDegree = function( d1, d2, delta) {
		if (d1 < 0) d1 += Math.PI * 2; 
		if (d2 < 0) d2 += Math.PI * 2; 
		if (d1 > Math.PI * 2) d1 -= Math.PI * 2; 
		if (d2 > Math.PI * 2) d2 -= Math.PI * 2; 
		return Math.abs(d1 - d2) < Math.PI * delta / 180.0; 
	}
	
	/**
	 * Scan and kill factory in the field of view
	 */
	surus.scanFactory = function(o) {
		o = o || surus.getOrientation(); 
		if (!factory.isDestroyed && surus.checkDegree(o, factory.degree, 30) ) {
			factory.die(); 
			score.val += 500; 
		}
	}
	
	/**
	 * Scan and kill garbage in the field of view
	 */
	surus.scanRubbish = function(o) {
		o = o || surus.getOrientation(); 
		for (var i = 0; i < Paras.garbage.count; ++i) {
			if (!garbage[i].isDestroyed && surus.checkDegree(o, garbage[i].degree, 20) ) {
				garbage.die(i);
				score.val += 100; 				
			}
		}
	}
	
	/**
	 * Scan and kill lamberman in the field of view
	 */
	surus.scanPeasant = function(o) {
		o = o || surus.getOrientation(); 
		if (!peasant.isDestroyed && surus.checkDegree(o, peasant.degree, 30) ) {
			peasant.die(); 
			score.val += 300; 
		}
	}
	/**
	 * God mode, scan all enemies
	 */
	surus.scanEnemy = function(o) {
		o = o || surus.getOrientation(); 
		scanFactory(o); 
		scanPeasant(o); 
		scanRubbish(o); 
	}
	
	surus.cheer = function() {
		console.log("Game ends, cheers!"); 
		surus.cheering = true; 
		var theta = surus.getOrientation(); 
		var R = 100; 
		surus.get().position.set(R * Math.cos(theta), Paras.surus.posY, R * Math.sin(theta)); 
		surus.get().rotateOnAxis(Y_AXIS, Math.PI); 
		surus.get().play('roar', Paras.surus.crossFade); 
		//surus.curState = SURUS_SPRAY; 
	}
	
	surus.syncCamera = function() {
		surus.nosePos.setFromMatrixPosition(surus.get().skeleton.bones[27].matrixWorld);
		surus.leftArmPos.setFromMatrixPosition(surus.get().skeleton.bones[15].matrixWorld);
		surus.rightArmPos.setFromMatrixPosition(surus.get().skeleton.bones[16].matrixWorld);
		surus.headPos.setFromMatrixPosition(surus.get().skeleton.bones[9].matrixWorld);
		
		if (surus.cheering === true) return; 
		
		if (Math.abs(camera.rotation.y) > Math.PI / 2 || ( Math.abs(camera.rotation.z) < Math.PI / 2 && Math.abs(camera.rotation.x) < Math.PI / 2 ) ) {
			surus.get().rotation.y = camera.rotation.y; 
		} else {
			if (camera.rotation.y > 0) {
				surus.get().rotation.y = Math.PI - camera.rotation.y;
			} else {
				surus.get().rotation.y = -Math.PI - camera.rotation.y; 
			}
			//surus.get().rotation.y = camera.rotation.y; 
		}
		/*
		quaternion to euler 
		
		angleheading = atan2(2*qy*qw-2*qx*qz , 1 - 2*qy2 - 2*qz2) 
		attitude = asin(2*qx*qy + 2*qz*qw)  
		bank = atan2(2*qx*qw-2*qy*qz , 1 - 2*qx2 - 2*qz2)
		
		except when qx*qy + qz*qw = 0.5 (north pole) which gives: 
		
		heading = 2 * atan2(x,w) bank = 0 
		
		and when qx*qy + qz*qw = -0.5 (south pole) which gives: 
		
		heading = -2 * atan2(x,w) bank = 0
		
		*/
		/*
		var lookAtVector = new THREE.Vector3(0,0, -1);
		lookAtVector.applyQuaternion(camera.quaternion);
		surus.get().rotation.y = lookAtVector.y; 
		*/
		/*
		var a = new THREE.Euler().setFromQuaternion( camera.quaternion, 'XYZ' );
		surus.get().rotation.y = a.y; 
		*/
	}

	surus.load( Paras.surus.fileName );
}

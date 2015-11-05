'use strict';
function initWater() {
	water.sys = new THREE.GPUParticleSystem({
        maxParticles: 200000
    });
	
	water.tick = 0; 
	
	water.opt = {
		position: new THREE.Vector3(20, 26, 20),
		velocity: new THREE.Vector3(1.5, 0, 1.5),
		positionRandomness: 2.0,
		velocityRandomness: 1.95,
		color: 0x66CCFF,
		colorRandomness: 0.8,
		turbulence: .08,
		lifetime: 2.0,
		size: 5.0,
		sizeRandomness: 19.0
	};
	
	water.spawn = {
		spawnRate: 15000,
		horizontalSpeed: 1.5,
		verticalSpeed: 1.33,
		timeScale: 1
	}
	
	water.update = function(delta) {
		// water at the nose
		water.opt.position.copy( surus.nosePos ); 
		
		water.tick += delta; 
		if (water.tick < 0) water.tick = 0;
		
		if (surus.curState === SURUS_SPRAY) {
			for (var x = 0; x < water.spawn.spawnRate * delta; x++) {
				water.sys.spawnParticle(water.opt);
			}
		}
		water.sys.update(water.tick);
	}
	
    scene.add(water.sys);
}

/*
	positionRandomness: .3,
	velocity: new THREE.Vector3(0.5, 0, 0.5),
	velocityRandomness: .5,
	color: 0x66CCFF,
	colorRandomness: .2,
	turbulence: .5,
	lifetime: 2,
	size: 5,
	sizeRandomness: 1
*/
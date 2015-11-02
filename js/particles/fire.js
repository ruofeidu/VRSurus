function initFire() {
	fire.sys = new THREE.GPUParticleSystem({
        maxParticles: 200000
    });
	
	fire.tick = 0; 
	
	fire.opt = {
		position: new THREE.Vector3(20, 26, 20),
		velocity: new THREE.Vector3(10, 0, 10),
		positionRandomness: 2.0,
		velocityRandomness: 1.95,
		color: 0xFF5500,
		colorRandomness: 0.8,
		turbulence: .08,
		lifetime: 8.0,
		size: 10.0,
		sizeRandomness: 19.0
	};
	
	fire.spawn = {
		spawnRate: 10000,
		horizontalSpeed: 1.5,
		verticalSpeed: 1.33,
		timeScale: 1
	}
	
	fire.update = function(delta) {
		fire.opt.position.copy( surus.nosePos ); 
		
		fire.tick += delta; 
		if (fire.tick < 0) fire.tick = 0;
		
		if (surus.curState === SURUS_SLAP_LEFT || surus.curState === SURUS_SLAP_RIGHT) {
			for (var x = 0; x < fire.spawn.spawnRate * delta; x++) {
				fire.sys.spawnParticle(fire.opt);
			}
		}
		fire.sys.update(fire.tick);
	}
	
    scene.add(fire.sys);
}

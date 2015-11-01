function initWater() {
	water.sys = new THREE.GPUParticleSystem({
        maxParticles: 250000
    });
	
	water.tick = 0; 
	
	water.opt = {
		position: new THREE.Vector3(20, 26, 20),
		positionRandomness: .3,
		velocity: new THREE.Vector3(0.5, 0, 0.5),
		velocityRandomness: .5,
		color: 0x66CCFF,
		colorRandomness: .2,
		turbulence: .5,
		lifetime: 2,
		size: 5,
		sizeRandomness: 1
	};
	
	water.spawn = {
		spawnRate: 15000,
		horizontalSpeed: 1.5,
		verticalSpeed: 1.33,
		timeScale: 1
	}
	
	water.update = function(delta) {
		water.opt.position.set( 15 * Math.cos(-surus.get().rotation.y+Paras.camera.theta), 26, 15 * Math.sin(-surus.get().rotation.y+Paras.camera.theta) ); 
		
		
		water.tick += delta; 
		if (water.tick < 0) water.tick = 0;
		for (var x = 0; x < water.spawn.spawnRate * delta; x++) {
			water.sys.spawnParticle(water.opt);
        }
		water.sys.update(water.tick);
	}
	
    scene.add(water.sys);
}

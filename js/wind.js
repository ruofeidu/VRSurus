function initWind() {
	wind.sys1 = new THREE.GPUParticleSystem({
        maxParticles: 50000
    });
	
	wind.sys2 = new THREE.GPUParticleSystem({
        maxParticles: 50000
    });
	
	wind.tick = 0; 
	
	wind.opt1 = {
		position: new THREE.Vector3(20, 26, 20),
		velocity: new THREE.Vector3(9, 0, 10),
		positionRandomness: 2.0,
		velocityRandomness: 0.4,
		color: 0x9DFF5C,
		colorRandomness: 0.2,
		turbulence: .08,
		lifetime: 5.0,
		size: 10.0,
		sizeRandomness: 5.0
	};
	
	wind.opt2 = {
		position: new THREE.Vector3(20, 26, 20),
		velocity: new THREE.Vector3(10, 0, 9),
		positionRandomness: 2.0,
		velocityRandomness: 0.4,
		color: 0x9DFF5C,
		colorRandomness: 0.2,
		turbulence: .08,
		lifetime: 5.0,
		size: 10.0,
		sizeRandomness: 5.0
	};
	
	wind.spawn = {
		spawnRate: 15000,
		horizontalSpeed: 1.5,
		verticalSpeed: 1.33,
		timeScale: 1
	}
	
	wind.update = function(delta) {
		wind.opt1.position.copy( surus.leftArmPos );  wind.opt1.position.y = 20; 
		wind.opt2.position.copy( surus.rightArmPos ); wind.opt2.position.y = 20; 
		
		wind.opt1.velocity.x = Math.cos( surus.getOrientation() ) * 10.0;
		wind.opt1.velocity.z = Math.sin( surus.getOrientation() ) * 9.0;
		wind.opt2.velocity.x = Math.cos( surus.getOrientation() ) * 9.0;
		wind.opt2.velocity.z = Math.sin( surus.getOrientation() ) * 10.0;
		
		
		wind.tick += delta; 
		if (wind.tick < 0) wind.tick = 0;
		
		if (surus.curState === SURUS_THRUST) {
			for (var x = 0; x < wind.spawn.spawnRate * delta; x++) {
				wind.sys1.spawnParticle(wind.opt1);
				wind.sys2.spawnParticle(wind.opt2);
			}
		}
		wind.sys1.update(wind.tick);
		wind.sys2.update(wind.tick);
	}
	
    scene.add(wind.sys1);
    scene.add(wind.sys2);
}

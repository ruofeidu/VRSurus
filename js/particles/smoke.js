'use strict';
/**
 * Init smoke
 */
 /*
function initSmoke() {
	smoke.sys = new ParticleEngine();
	
	smoke.tick = 0; 
	
	smoke.opt = {
		positionStyle    : Type.CUBE,
		positionBase     : new THREE.Vector3( 100, 10, 100 ),
		positionSpread   : new THREE.Vector3( 10, 0, 10 ),

		velocityStyle    : Type.CUBE,
		velocityBase     : new THREE.Vector3( 0, 150, 0 ),
		velocitySpread   : new THREE.Vector3( 80, 50, 80 ), 
		accelerationBase : new THREE.Vector3( 0,-10,0 ),
		
		particleTexture : THREE.ImageUtils.loadTexture( 'images/smoke.png'),

		angleBase               : 0,
		angleSpread             : 720,
		angleVelocityBase       : 0,
		angleVelocitySpread     : 720,
		
		sizeTween    : new Tween( [0, 1], [32, 128] ),
		opacityTween : new Tween( [0.8, 2], [0.5, 0] ),
		colorTween   : new Tween( [0.4, 1], [ new THREE.Vector3(0,0,0.2), new THREE.Vector3(0, 0, 0.5) ] ),

		particlesPerSecond : 200,
		particleDeathAge   : 2.0,		
		emitterDeathAge    : 60
	};
	smoke.enabled = true;
	smoke.update = function(delta) {
		smoke.sys.update(delta);
	}
	
	smoke.sys.setValues( smoke.opt );
	smoke.sys.initialize();
}
*/

function initSmoke() {
	smoke.sys = new THREE.GPUParticleSystem({
        maxParticles: 300,
		textureFile: 'textures/smoke.png'
    });
	
	smoke.tick = 0; 
	
	smoke.opt = {
		position: new THREE.Vector3(20, 26, 20),
		velocity: new THREE.Vector3(0, 40, 0),
		positionRandomness: 10.0,
		velocityRandomness: 1.95,
		color: 0x000000,
		colorRandomness: 0.01,
		turbulence: .01,
		lifetime: 8.0,
		size: 200.0,
		sizeRandomness: 19.0
	};
	
	smoke.spawn = {
		spawnRate: 10000,
		horizontalSpeed: 1.5,
		verticalSpeed: 1.33,
		timeScale: 1
	}
	
	smoke.enabled = false;
	smoke.brighter = false; 
	
	smoke.play = function() {
		smoke.enabled = true; 
		smoke.brighter = true; 
	}
	
	smoke.update = function(delta) {
		if (!smoke.enabled) return; 
		smoke.opt.position.set(50 * Math.cos(factory.degree), 30, 50 * Math.sin(factory.degree)); 
		
		smoke.tick += delta; 
		if (smoke.tick < 0) smoke.tick = 0;
		
		if (smoke.enabled) {
			if (smoke.brighter) {
				smoke.opt.colorRandomness += 0.02; 
				if (smoke.opt.colorRandomness > 0.4) {
					smoke.opt.colorRandomness += 0.01; 
				}
				if (smoke.opt.colorRandomness > 0.5) {
					smoke.brighter = false; 
				}
			} else {
				smoke.opt.colorRandomness -= 0.02; 
				if (smoke.opt.colorRandomness <= 0) {
					smoke.opt.colorRandomness = 0.01; 
					smoke.enabled = false; 
				}
			}
			
			for (var x = 0; x < smoke.spawn.spawnRate * delta; x++) {
				smoke.sys.spawnParticle(smoke.opt);
			}
		}
		smoke.sys.update(smoke.tick);
	}
	
    scene.add(smoke.sys);
}
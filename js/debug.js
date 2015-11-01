'use strict';

function initGUI() {
	var gui = new dat.GUI();
	var p = gui.addFolder('Camera Parameters');
	/*
	p.add(camera.rotation, "x", -1.6, 1.6).step(0.1).listen();
	p.add(camera.rotation, "y", -1.6, 1.6).step(0.1).listen();
	p.add(camera.rotation, "z", -1.6, 1.6).step(0.1).listen();
	p.add(camera.position, "x", -10.0, 10.0).step(0.1).listen();
	p.add(camera.position, "y", 25.0, 27.0).step(0.1).listen();
	p.add(camera.position, "z", -10.0, 10.0).step(0.1).listen();
	*/
	p.add(Paras.camera, "posX", -10.0, 10.0);
	p.add(Paras.camera, "posY", 0, 100.0);
	p.add(Paras.camera, "posZ", -10.0, 10.0);
	p.add(Paras.camera, "theta", -5.0, 5.0);
	//p.open(); 
	
	p = gui.addFolder('Surus Parameters');
	p.add(surus.nosePos, "x", -1.0, 1.0).listen();
	p.add(surus.nosePos, "y", -1.0, 1.0).listen();
	p.add(surus.nosePos, "z", -1.0, 1.0).listen();
	
	p.add(Paras.surus, "posX", -20.0, 20.0);
	p.add(Paras.surus, "posY", 0, 100.0);
	p.add(Paras.surus, "posZ", -20.0, 20.0);
	//p.open(); 
	
	p = gui.addFolder('Water Parameters');
	p.add(water.opt, "velocityRandomness", 0, 3);
	p.add(water.opt, "positionRandomness", 0, 3);
	p.add(water.opt, "size", 1, 20);
	p.add(water.opt, "sizeRandomness", 0, 25);
	p.add(water.opt, "colorRandomness", 0, 1);
	p.add(water.opt, "lifetime", .1, 10);
	p.add(water.opt, "turbulence", 0, 1);
	
	
	p = gui.addFolder('Wind Parameters');
	p.add(wind.opt1.velocity, "x", -9.9, 9.9);
	p.add(wind.opt1.velocity, "y", -9.9, 9.9);
	p.add(wind.opt1.velocity, "z", -9.9, 9.9);
	p.add(wind.opt1, "velocityRandomness", 0, 3);
	p.add(wind.opt1, "positionRandomness", 0, 3);
	p.add(wind.opt1, "size", 1, 20);
	p.add(wind.opt1, "sizeRandomness", 0, 25);
	p.add(wind.opt1, "colorRandomness", 0, 1);
	p.add(wind.opt1, "lifetime", .1, 10);
	p.add(wind.opt1, "turbulence", 0, 1);
}

function initDebugBall() {
	var geometry = new THREE.SphereGeometry( 2, 32, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	debugBall = new THREE.Mesh( geometry, material );
	debugBall.position.set( 20, 26, 20 );
	scene.add( debugBall );
}
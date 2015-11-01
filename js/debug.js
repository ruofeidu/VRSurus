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
	p.add(Paras.surus, "posX", -20.0, 20.0);
	p.add(Paras.surus, "posY", 0, 100.0);
	p.add(Paras.surus, "posZ", -20.0, 20.0);
	//p.open(); 
	
	var geometry = new THREE.SphereGeometry( 2, 32, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	debugBall = new THREE.Mesh( geometry, material );
	debugBall.position.set( 20, 26, 20 );
	scene.add( debugBall );
}
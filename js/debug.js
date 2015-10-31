'use strict';

function initGUI() {
	var gui = new dat.GUI();
	var p = gui.addFolder('Camera Parameters');
	p.add(Paras.camera, "posX", -10.0, 10.0);
	p.add(Paras.camera, "posY", 0, 100.0);
	p.add(Paras.camera, "posZ", -10.0, 10.0);
	//p.open(); 
	
	p = gui.addFolder('Surus Parameters');
	p.add(Paras.surus, "posX", -20.0, 20.0);
	p.add(Paras.surus, "posY", 0, 100.0);
	p.add(Paras.surus, "posZ", -20.0, 20.0);
	//p.open(); 
}
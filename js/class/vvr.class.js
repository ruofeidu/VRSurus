'use strict';
/** 
 * VR Manager
 */
var vvr = {
	enabled : true,
	inited : false,
	manager : null, 
	effect : null, 
	controls : null,
}

// Effect and Controls for VR
vvr.init = function(renderer, camera) {
	if (!this.enabled) return; 
	this.effect = new THREE.VREffect(renderer);
	this.controls = new THREE.VRControls(camera);
	this.controls.scale = 0.1; 
	this.manager = new WebVRManager(renderer, this.effect);
	this.inited = true; 
}

vvr.isEnabled = function() {
	return this.inited && this.manager.isVRMode(); 
}

vvr.updateCamera = function() {
	if (this.inited) {
		this.controls.update();
	}
}
'use strict';
/**
 * Init the instruction sprite billboard.
 */
function initInstruction() {
	instruction.windTex = THREE.ImageUtils.loadTexture('images/wind.png'); 
	instruction.waterTex = THREE.ImageUtils.loadTexture('images/water.png'); 
	instruction.fireTex = THREE.ImageUtils.loadTexture('images/fire.png'); 
	
	instruction.wind = new THREE.Sprite( new THREE.SpriteMaterial( { map: instruction.windTex, transparent: true } ) );
	instruction.wind.position.set( 0, 0, 1 );
	instruction.wind.scale.set( 512, 512, 1 );
	instruction.wind.visible = false; 
	
	instruction.water = new THREE.Sprite( new THREE.SpriteMaterial( { map: instruction.waterTex, transparent: true } ) );
	instruction.water.position.set( 0, 0, 1 );
	instruction.water.scale.set( 512, 512, 1 );
	instruction.water.visible = false; 
	
	instruction.fire = new THREE.Sprite( new THREE.SpriteMaterial( { map: instruction.fireTex, transparent: true } ) );
	instruction.fire.position.set( 0, 0, 1 );
	instruction.fire.scale.set( 512, 512, 1 );
	instruction.fire.visible = false; 
	
	
	sceneOrtho.add( instruction.wind );
	sceneOrtho.add( instruction.fire );
	sceneOrtho.add( instruction.water );
	
	instruction.showWind = function() {
		instruction.wind.visible = true; 
		setTimeout(function(){ instruction.wind.visible = false;  }, 5000);
	}
	
	instruction.showWater = function() {
		instruction.water.visible = true; 
		setTimeout(function(){ instruction.water.visible = false;  }, 5000);
	}
	
	instruction.showFire = function() {
		instruction.fire.visible = true; 
		setTimeout(function(){ instruction.fire.visible = false;  }, 5000);
	}
	
	instruction.hide = function() {
		instruction.wind.visible = false; 
	}
}

'use strict';
/**
 * Init the instruction sprite billboard.
 */
function initInstruction() {
	instruction.windTex = THREE.ImageUtils.loadTexture('images/wind.png'); 
	instruction.waterTex = THREE.ImageUtils.loadTexture('images/water.png'); 
	instruction.fireTex = THREE.ImageUtils.loadTexture('images/fire.png'); 
	instruction.insTex = THREE.ImageUtils.loadTexture('images/instruction.png'); 
	
	instruction.ins = new THREE.Sprite( new THREE.SpriteMaterial( { map: instruction.insTex, transparent: true } ) );
	instruction.ins.position.set( 0, 0, 1 );
	instruction.ins.scale.set( 512, 512, 1 );
	instruction.ins.visible = false; 
	
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
	
	sceneOrtho.add( instruction.ins );
	sceneOrtho.add( instruction.wind );
	sceneOrtho.add( instruction.fire );
	sceneOrtho.add( instruction.water );
	
	instruction.showIns = function() {
		instruction.ins.visible = true; 
		audio.v_instruction.play(); 
		setTimeout(function(){ instruction.ins.visible = false; game.tutorial();  }, 7000);
	}
	
	instruction.showWind = function() {
		instruction.ins.visible = false;
		instruction.wind.visible = true; 
		audio.v_wind.play(); 
		setTimeout(function(){ instruction.wind.visible = false;  }, 5000);
	}
	
	instruction.showWater = function() {
		instruction.wind.visible = false;
		instruction.water.visible = true; 
		audio.v_water.play(); 
		setTimeout(function(){ instruction.water.visible = false;  }, 5000);
	}
	
	instruction.showFire = function() {
		instruction.water.visible = false;
		instruction.fire.visible = true; 
		audio.v_fire.play(); 
		setTimeout(function(){ instruction.fire.visible = false;  }, 5000);
	}
	
	instruction.hide = function() {
		instruction.wind.visible = false; 
	}
}

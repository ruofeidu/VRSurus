'use strict';
/**
 * Init the tto sprite billboard.
 * TTO means three, two, one, go!
 * @author Ruofei Du
 */
function initTTO() {
	tto.canvas = document.createElement('canvas');
	tto.canvas.width = 512; 
	tto.canvas.height = 512; 
	tto.context = tto.canvas.getContext('2d');
	tto.context.font = "Bold 40px Arial";
	tto.context.fillStyle = "rgba(255,255,255,0.95)";
	tto.texture = new THREE.Texture(tto.canvas) 
	tto.texture.needsUpdate = true;
	
	var material = new THREE.SpriteMaterial( { color: 0xFF4000, map: tto.texture, transparent: true, alphaTest: 0.5 } );
	tto.mesh = new THREE.Sprite( material );
	tto.mesh.position.set( 0, 0, 1 );
	tto.mesh.visible = false; 
	tto.scale = 1.2; 
	tto.mesh.scale.set( tto.canvas.width * tto.scale, tto.canvas.height * tto.scale, 1 );
	sceneOrtho.add( tto.mesh );
	
	tto.play = function() {
		tto.three(); 
	}
	
	tto.three = function() {
		tto.texture.needsUpdate = true;
		tto.scale = 1.2; 
		tto.mesh.visible = true; 
		
		tto.context.clearRect(0, 0, tto.canvas.width, tto.canvas.height);
		tto.context.fillText('3', 256, 256);
		tto.animateScale(); 
		setTimeout(function(){ tto.two() }, 1000);
	}
	
	tto.two = function() {
		tto.texture.needsUpdate = true;
		tto.mesh.visible = true; 
		tto.scale = 1.2; 
		
		tto.context.clearRect(0, 0, tto.canvas.width, tto.canvas.height);
		tto.context.fillText('2', 256, 256);
		tto.animateScale(); 
		setTimeout(function(){ tto.one() }, 1000);
	}
	
	tto.one = function() {
		tto.texture.needsUpdate = true;
		tto.mesh.visible = true; 
		tto.scale = 1.2; 
		
		tto.context.clearRect(0, 0, tto.canvas.width, tto.canvas.height);
		tto.context.fillText('1', 256, 256);
		tto.animateScale(); 
		setTimeout(function(){ tto.go() }, 1000);
	}
	
	tto.go = function() {
		tto.texture.needsUpdate = true;
		tto.mesh.visible = true; 
		tto.scale = 1.2; 
		
		tto.context.clearRect(0, 0, tto.canvas.width, tto.canvas.height);
		tto.context.fillText('GO', 256, 256);
		tto.animateScale(); 
		setTimeout(function(){ tto.hide() }, 1000);
	}
	
	tto.animateScale = function() {
		tto.scale += 0.1; 
		if (tto.scale > 3.0) return; 
		tto.mesh.scale.set( tto.canvas.width * tto.scale, tto.canvas.height * tto.scale, 1 );
		setTimeout(function(){ tto.animateScale() }, 10);
	}
	
	tto.hide = function() {
		tto.mesh.visible = false; 
	}
	
	tto.updateHUD = function() {
		tto.mesh.position.set( 0, 0, 1 );
	}
}

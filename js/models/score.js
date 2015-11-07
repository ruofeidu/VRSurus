'use strict';
/**
 * Init the score sprite billboard.
 */
function initScore() {
	score.val = 0; 
	
	score.canvas = document.createElement('canvas');
	score.canvas.width = 512; 
	score.canvas.height = 512; 
	score.context = score.canvas.getContext('2d');
	score.texture = new THREE.Texture(score.canvas) 
	score.texture.needsUpdate = true;
	
	var material = new THREE.SpriteMaterial( { color: 0xFF4000, map: score.texture, transparent: true, alphaTest: 0.5 } );
	score.mesh = new THREE.Sprite( material );
	score.mesh.position.set( 0, 0, 1 );
	score.mesh.visible = false; 
	score.mesh.scale.set( score.canvas.width * 1.2, score.canvas.height * 1.2, 1 );
	sceneOrtho.add( score.mesh );
	
	score.show = function() {
		score.texture.needsUpdate = true;
		score.mesh.visible = true; 
		
		score.context.font = "Bold 40px Arial";
		score.context.fillStyle = "rgba(255,255,255,0.95)";
		score.context.clearRect(0, 0, score.canvas.width, score.canvas.height);
		score.context.fillText('Awesome!', 160, 256 - 40 - 10);
		score.context.font = "Bold 30px Arial";
		score.context.fillText('You saved ' + score.val + ' trees!', 128, 256);
	}
	
	score.hide = function() {
		score.mesh.visible = false; 
	}
	
	score.updateHUD = function() {
		score.mesh.position.set( 0, 0, 1 );
	}
}

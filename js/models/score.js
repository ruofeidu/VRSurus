'use strict';

// learnt from https://github.com/MozVR/panorama-viewer/blob/master/js/main.js
function bend( group, amount, multiMaterialObject ) {
	function bendVertices( mesh, amount, parent ) {
		var vertices = mesh.geometry.vertices;

		if (!parent) {
			parent = mesh;
		}

		for (var i = 0; i < vertices.length; i++) {
			var vertex = vertices[i];

			// apply bend calculations on vertexes from world coordinates
			parent.updateMatrixWorld();

			var worldVertex = parent.localToWorld(vertex);

			var worldX = Math.sin( worldVertex.x / amount) * amount;
			var worldZ = - Math.cos( worldVertex.x / amount ) * amount;
			var worldY = worldVertex.y 	;

			// convert world coordinates back into local object coordinates.
			var localVertex = parent.worldToLocal(new THREE.Vector3(worldX, worldY, worldZ));
			vertex.x = localVertex.x;
			vertex.z = localVertex.z+amount;
			vertex.y = localVertex.y;
		}

		mesh.geometry.computeBoundingSphere();
		mesh.geometry.verticesNeedUpdate = true;
	}

	for ( var i = 0; i < group.children.length; i ++ ) {
		var element = group.children[ i ];

		if (element.geometry.vertices) {
			if (multiMaterialObject) {
				bendVertices( element, amount, group);
			} else {
				bendVertices( element, amount);
			}
		}
	}
}

/**
 * Init the score sprite billboard.
 */
function initScore() {
	score.val = 0; 
	
	score.canvas = document.createElement('canvas');
	score.canvas.width = 512; 
	score.canvas.height = 512; 
	score.context = score.canvas.getContext('2d');

	//score.context.fillRect(0, 0, score.canvas.width, score.canvas.height);

	score.texture = new THREE.Texture(score.canvas) 
	score.texture.needsUpdate = true;
	//score.texture.minFilter = THREE.LinearFilter; 
	
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
		//score.context.fillText('Great Job!' + score.val, 95, 50);
		score.context.fillText('Your Score: ' + score.val, 128, 256);
	}
	
	score.hide = function() {
		score.mesh.visible = false; 
	}
	
	score.updateHUD = function() {
		var width = window.innerWidth / 2;
		var height = window.innerHeight / 2;

		var material = score.mesh.material;

		var imageWidth = material.map.image.width / 2;
		var imageHeight = material.map.image.height / 2;

		score.mesh.position.set( 0, 0, 1 ); // center
	}
}

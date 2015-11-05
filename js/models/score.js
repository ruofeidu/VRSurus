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
	score.context = score.canvas.getContext('2d');
	score.context.font = "Bold 20px Arial";
	score.context.fillStyle = "rgba(255,255,255,0.95)";
	score.context.clearRect(0, 0, score.canvas.width, score.canvas.height);
	score.context.fillText('Score: ' + score.val, 85, 100);

	score.texture = new THREE.Texture(score.canvas) 
	score.texture.needsUpdate = true;
	
	var material = new THREE.SpriteMaterial( { color: 0xFF4000, map: score.texture, transparent: true, alphaTest: 0.5 } );
	score.mesh = new THREE.Sprite( material );
	score.mesh.position.set( 50, 50, 0 );
	score.mesh.scale.set( 64, 64, 1.0 );
	scene.add( score.mesh );
	
	score.show = function() {
		score.texture.needsUpdate = true;
		score.mesh.visible = true; 
	}
	
	score.needsUpdate = function() {
		return score.mesh.visible; 
	}
}

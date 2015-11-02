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

function initScore() {
	/*
	var geometry = new THREE.PlaneGeometry( 5, 20, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
	score = new THREE.Mesh( geometry, material );
	score.lookAt( camera.position );
	scene.add( score );
	*/
	score.text = "score: 0",
	score.geometry = new THREE.TextGeometry( score.text, {
		size: 50,
		height: 20,
		curveSegments: 4,
		font: "optimer",
		weight: "bold",
		style: "normal",
		bevelThickness: 2,
		bevelSize: 1.5,
		bevelEnabled: true,
		material: 0,
		extrudeMaterial: 1
	});
	
	score.geometry.computeBoundingBox();
	score.geometry.computeVertexNormals();
	
	scene.material = new THREE.MeshFaceMaterial( [
		new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
		new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
	] );
				
	score = new THREE.Object3D();
	var mesh = new THREE.Mesh( score.geometry, score.material );
	score.add( mesh );
	score.scale.set( 1, 1, 1 );
	//bend(score, 100);
	mesh.renderOrder = 1;
	scene.add( score ); 
	
	score.mesh2 = new THREE.Mesh( score.geometry, score.material );
	scene.add(score.mesh2); 
	score.mesh2.position.set(20, 20, 20); 
	/*
	var ch = String.fromCharCode( keyCode );
					text += ch;
					*/
	score.update = function(R,theta) {
		Paras.score.pos.copy(Paras.score.relPos);
		Paras.score.pos.applyMatrix4( camera.matrixWorld );
		
		score.position.copy(Paras.score.pos); 
		score.lookAt(camera.position); 
	}
}

function getTreeMaterial (texture, shadow) {
	var uniforms = {
		color : { type: "c", value: new THREE.Color() },
		map: { type: "t", value: texture },
		shadow: { type: "t", value: shadow },
		globalTime : { type: "f", value: 0.0 },
		lightPos : { type: "v2", value: new THREE.Vector2() },
		fogColor : { type: "c", value: scene.fog.color },
		fogNear : { type: "f", value: scene.fog.near },
		fogFar : { type: "f", value: scene.fog.far },
	};
	var material = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: document.getElementById( 'vs_tree' ).textContent,
		fragmentShader: document.getElementById( 'fs_tree' ).textContent,
		transparent: true,
		side: THREE.DoubleSide,
	} );
	return material;
}

function getBarkMaterial(shadowMap) {
	var material = new THREE.MeshPhongMaterial( {
		color: 0x331100,
		specular: 0x444444,
		shininess: 1000,
		reflectivity: 0,
		map: THREE.ImageUtils.loadTexture( "images/tree-grey.jpg", undefined, checkLoading ),
		normalMap: THREE.ImageUtils.loadTexture( "images/tree-normal.jpg", undefined, checkLoading ),
		aoMap: shadowMap,
		normalScale: new THREE.Vector2( 1, 1 ), 
		aoMapIntensity: 1,
		displacementBias: -0.428408,
		displacementScale: 2.436143,
		combine: THREE.AddOperation,
		side: THREE.DoubleSide
	} );
	
	material.map.wrapS = THREE.RepeatWrapping;			material.map.wrapT = THREE.RepeatWrapping;
	material.normalMap.wrapS = THREE.RepeatWrapping;	material.normalMap.wrapT = THREE.RepeatWrapping;
	return material; 
}

function treeLoaded( geometry, mm ) {
	var texture = THREE.ImageUtils.loadTexture( "images/leaves.png", undefined, checkLoading );
	var shadow = THREE.ImageUtils.loadTexture( "images/leaves_shadow.jpg", undefined, checkLoading );
	shadow.wrapS = THREE.MirroredRepeatWrapping;		shadow.wrapT = THREE.MirroredRepeatWrapping;
	texture.wrapS = THREE.RepeatWrapping;				texture.wrapT = THREE.RepeatWrapping;
	
	// bark
	var bark = getBarkMaterial(shadow); 
	console.log(bark); 
	
	// cap
	var cap = new THREE.MeshPhongMaterial( {map: THREE.ImageUtils.loadTexture( "images/trunk.jpg", undefined, checkLoading ), color: 0x333333, side: THREE.DoubleSide} );
	var branches = new THREE.MeshPhongMaterial( {map: THREE.ImageUtils.loadTexture( "images/branch.png", undefined, checkLoading ), transparent: true, alphaTest: 0.5, side: THREE.DoubleSide} );
	var c = new THREE.Color().setHSL(0.25,0.3,0.5);				branches.color = c;
	branches.map.minFilter = THREE.LinearFilter; 
	var grid = new THREE.PlaneGeometry( 2000, 2000, 4, 5 );
	grid.applyMatrix( new THREE.Matrix4().makeRotationFromEuler( new THREE.Euler( -Math.PI/2, 0, 0, 'XYZ' ) ) );
	//grid.applyMatrix( new THREE.Matrix4().setPosition( new THREE.Vector3( 0, 0, -1000 ) ) );
	
	var num = grid.faces.length;
	// trees
	for (var i = 0; i < num; i++) {
		var material0 = getTreeMaterial(texture, shadow);
		
		var c = new THREE.Color().setHSL(0.2+Math.random()*0.05,0.3,0.5);
		material0.uniforms.color.value = c;
		var mf = new THREE.MeshFaceMaterial( [bark, cap, material0, material0, branches] );
		var tree = new THREE.Mesh( geometry, mf );
		var s = 13+Math.random()*12;
		tree.scale.set(s,s,s);
		var f = grid.faces[i];
		var centroid = computeCentroid(f, grid); 
		
		if (Math.abs(centroid.x) < 300) tree.isCenter = true;
		tree.position.set( centroid.x + Math.random()*100-50, Math.random()-5, centroid.z + Math.random()*100-50 )
		tree.rotation.y = Math.random()*(Math.PI*2);
		tree.rotation.x = Math.random()*0.4-0.2;
		tree.rotation.z = Math.random()*0.4-0.2;
		scene.add(tree);
		trees.push(tree);
		objects.push(tree);
	}
	// 2 extras
	for (var i = 0; i < 2; i++) {
		
		var material0 = getTreeMaterial(texture, shadow);
		var c = new THREE.Color().setHSL(0.2+Math.random()*0.05,0.3,0.5);
		material0.uniforms.color.value = c;
		var mf = new THREE.MeshFaceMaterial( [bark, cap, material0, material0, branches] );

		var tree = new THREE.Mesh( geometry, mf );
		var s = 13+Math.random()*12;
		tree.scale.set(s,s,s);
		tree.isCenter = true;
		var x = i*500 - 250 + Math.random()*100-50;
		tree.position.set( x, Math.random()-5, -2200 + Math.random()*100-50 )

		tree.rotation.y = Math.random()*(Math.PI*2);
		tree.rotation.x = Math.random()*0.4-0.2;
		tree.rotation.z = Math.random()*0.4-0.2;
		scene.add(tree);
		trees.push(tree);
		objects.push(tree);
	}

	// thinner "trees"
	var cylinderGeometry = new THREE.CylinderGeometry( 0.5, 5, 300, 10, 20, true );
	cylinderGeometry.applyMatrix( new THREE.Matrix4().setPosition( new THREE.Vector3( 0, 150, 0 ) ) );
	cylinderGeometry.mergeVertices();
	for (var i = 0; i < cylinderGeometry.vertices.length; i++) {
		cylinderGeometry.vertices[i].x += Math.sin(cylinderGeometry.vertices[i].y*0.02)*5;
		cylinderGeometry.vertices[i].z += Math.cos(cylinderGeometry.vertices[i].y*0.015)*10;
		
		var y = cylinderGeometry.vertices[i].y;
		cylinderGeometry.vertices[i].multiplyScalar(1+Math.random()*0.5);
		cylinderGeometry.vertices[i].y = y;
	}
	cylinderGeometry.computeVertexNormals();
	cylinderGeometry.computeFaceNormals();

	bark2 = getBarkMaterial(shadow);

	for (var i = 0; i < 30; i++) {
		var mesh = new THREE.Mesh(cylinderGeometry, bark2);
		var s = 1 + Math.random()*1;
		mesh.scale.set(s, s, s);
		var x = Math.random()*2000-1000;
		while (x > -60 && x < 60) {
			x = Math.random()*2000-1000
		}
		mesh.position.set( x, Math.random()-20, Math.random()*-2000 )
		
		mesh.rotation.y = Math.random()*(Math.PI*2);
		mesh.rotation.x = Math.random()*0.2-0.1;
		mesh.rotation.z = Math.random()*0.2-0.1;
		scene.add(mesh);
		objects.push(mesh);
	}
	// birch
	var cylinderGeometry = new THREE.CylinderGeometry( 2, 6, 300, 12, 1, true );
	cylinderGeometry.applyMatrix( new THREE.Matrix4().setPosition( new THREE.Vector3( 0, 150, 0 ) ) );
	cylinderGeometry.mergeVertices();

	bark3 = getBarkMaterial(shadow);
	for (var i = 0; i < 20; i++) {
		var mesh = new THREE.Mesh(cylinderGeometry, bark3);
		var s = 1+Math.random()*1;
		mesh.scale.set(s,s,s);
		var x = Math.random()*2000-1000;
		while (x > -250 && x < 250) {
			x = Math.random()*2000-1000
		}
		mesh.position.set( x, 0, Math.random()*-2000 )
		
		mesh.rotation.y = Math.random()*(Math.PI*2);
		mesh.rotation.x = Math.random()*0.1-0.05;
		mesh.rotation.z = Math.random()*0.1-0.05;
		scene.add(mesh);
		objects.push(mesh);
	}
	// sticks
	var numSticks = 70;
	var plane = new THREE.PlaneGeometry( 0.5, 300, 1, 20 );
	for (var i = 0; i < plane.vertices.length; i++) {
		plane.vertices[i].x += Math.sin(plane.vertices[i].y*0.05)*4;
	}
	var material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
	for (var i = 0; i < numSticks; i++) {
	
		var mesh = new THREE.Mesh(plane, material);
		mesh.scale.x = 1+Math.random()*0.5;
		mesh.scale.z = 1+Math.random()*0.5;
		var x = Math.random()*1400-700;
		while (x > -70 && x < 70) {
			x = Math.random()*1400-700;
		}

		mesh.position.y = 150 + Math.random()*100;
		mesh.position.x = x
		mesh.position.z = Math.random()*-2000;
		mesh.rotation.y = Math.random()*Math.PI;
		scene.add(mesh);
		objects.push(mesh);
	}
}

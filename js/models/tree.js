'use strict';

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

function getBarkMaterial(diffuseTex, normalTex, shadowTex) {
	var material = new THREE.MeshPhongMaterial( {
		color: 0x331100,
		specular: 0x444444,
		shininess: 2,
		reflectivity: 0,
		map: diffuseTex,
		normalMap: normalTex,
		aoMap: shadowTex,
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

function getBarkMaterial2(diffuseTex, normalTex, shadowTex) {
	var material = new THREE.MeshPhongMaterial( {
		color: 0xffffff,
		specular: 0x111111,
		shininess: 1,
		reflectivity: 0,
		map: diffuseTex,
		normalMap: normalTex,
		aoMap: shadowTex,
		normalScale: new THREE.Vector2( 20, 10 ), 
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

function getBarkMaterial3(diffuseTex, normalTex, shadowTex) {
	var material = new THREE.MeshPhongMaterial( {
		color: 0x331100,
		specular: 0x444444,
		shininess: 30,
		reflectivity: 0,
		map: diffuseTex,
		normalMap: normalTex,
		aoMap: shadowTex,
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
	var texture = THREE.ImageUtils.loadTexture( "images/leaves.png", undefined, checkLoading );				texture.wrapS = THREE.RepeatWrapping;				texture.wrapT = THREE.RepeatWrapping;
	var shadow = THREE.ImageUtils.loadTexture( "images/leaves-shadow.jpg", undefined, checkLoading );		shadow.wrapS = THREE.MirroredRepeatWrapping;		shadow.wrapT = THREE.MirroredRepeatWrapping;
	var barkDiffuse = THREE.ImageUtils.loadTexture( "images/bark-diffuse.jpg", undefined, checkLoading); 
	var barkNormal = THREE.ImageUtils.loadTexture( "images/bark-normal.jpg", undefined, checkLoading ); 
	//var bark3Diffuse = THREE.ImageUtils.loadTexture( "images/bark3-diffuse.jpg", undefined, checkLoading); 
	//var bark3Normal = THREE.ImageUtils.loadTexture( "images/bark3-normal.jpg", undefined, checkLoading ); 
	
	// bark
	var bark = getBarkMaterial(barkDiffuse, barkNormal, shadow); 
	
	// cap
	var cap = new THREE.MeshPhongMaterial( {map: THREE.ImageUtils.loadTexture( "images/trunk.jpg", undefined, checkLoading ), color: 0x333333, side: THREE.DoubleSide} );
	var branches = new THREE.MeshPhongMaterial( {map: THREE.ImageUtils.loadTexture( "images/branch.png", undefined, checkLoading ), transparent: true, alphaTest: 0.5, side: THREE.DoubleSide} );  
	var c = new THREE.Color().setHSL(0.25, 0.3, 0.5);				branches.color = c;
	branches.map.minFilter = THREE.LinearFilter; 
	var grid = new THREE.PlaneGeometry( 2000, 2000, 4, 5 );
	grid.applyMatrix( new THREE.Matrix4().makeRotationFromEuler( new THREE.Euler( -Math.PI/2, 0, 0, 'XYZ' ) ) );
	var num = grid.faces.length;
	
	// trees
	for (var i = 0; i < num + 2; i++) {
		var material0 = getTreeMaterial(texture, shadow);
		material0.uniforms.color.value = new THREE.Color().setHSL(0.2 + Math.random() * 0.05, 0.3, 0.5);
		var mf = new THREE.MeshFaceMaterial( [bark, cap, material0, material0, branches] );
		var tree = new THREE.Mesh( geometry, mf );
		var s = 13 + Math.random() * 12;
		tree.scale.set(s, s, s);
		
		if (i >= num) {
			tree.isCenter = true;
			var x = i * 500 - 250 + Math.random() * 100 - 50;
			tree.position.set( x, Math.random()-5, -2200 + Math.random() * 100 - 50 );
		} else {
			var f = grid.faces[i];
			var centroid = computeCentroid(f, grid); 
			if (Math.abs(centroid.x) < 300) tree.isCenter = true;
			tree.position.set( centroid.x + Math.random()*100 - 50, Math.random() - 5, centroid.z + Math.random() * 100 - 50 );
		}
		
		tree.rotation.y = Math.random() * (Math.PI * 2);
		tree.rotation.x = Math.random() * 0.4 - 0.2;
		tree.rotation.z = Math.random() * 0.4 - 0.2;
		scene.add(tree);
		trees.push(tree);
		objects.push(tree);
	}
	
	// thinner "trees"
	var cylinderGeometry = new THREE.CylinderGeometry( 0.5, 5, 300, 10, 20, true );
	cylinderGeometry.applyMatrix( new THREE.Matrix4().setPosition( new THREE.Vector3( 0, 150, 0 ) ) );
	cylinderGeometry.mergeVertices();
	for (var i = 0; i < cylinderGeometry.vertices.length; i++) {
		cylinderGeometry.vertices[i].x += Math.sin(cylinderGeometry.vertices[i].y * 0.02) * 5;
		cylinderGeometry.vertices[i].z += Math.cos(cylinderGeometry.vertices[i].y * 0.015) * 10;
		
		var y = cylinderGeometry.vertices[i].y;
		cylinderGeometry.vertices[i].multiplyScalar(1+Math.random()*0.5);
		cylinderGeometry.vertices[i].y = y;
	}
	cylinderGeometry.computeVertexNormals();
	cylinderGeometry.computeFaceNormals();

	var bark2 = getBarkMaterial2(barkDiffuse, barkNormal, shadow);

	for (var i = 0; i < 30; i++) {
		var mesh = new THREE.Mesh(cylinderGeometry, bark2);
		var s = 1 + Math.random()*1;
		mesh.scale.set(s, s, s);
		var theta = Math.random() * Math.PI * 2, radius = Math.random() * 1400 + 100;
		mesh.position.set( radius * Math.sin(theta), Math.random() - 20, radius * Math.cos(theta) )
		
		mesh.rotation.y = Math.random()*(Math.PI*2);
		mesh.rotation.x = Math.random()*0.2-0.1;
		mesh.rotation.z = Math.random()*0.2-0.1;
		scene.add(mesh);
		objects.push(mesh);
	}
	
	// birch
	cylinderGeometry = new THREE.CylinderGeometry( 2, 6, 300, 12, 1, true );
	cylinderGeometry.applyMatrix( new THREE.Matrix4().setPosition( new THREE.Vector3( 0, 150, 0 ) ) );
	cylinderGeometry.mergeVertices();

	var bark3 = getBarkMaterial2(barkDiffuse, barkNormal, shadow);
	for (var i = 0; i < 20; i++) {
		var mesh = new THREE.Mesh(cylinderGeometry, bark3);
		var s = 1+Math.random()*1;
		mesh.scale.set(s, s, s);
		var theta = Math.random() * Math.PI * 2, radius = Math.random() * 1400 + 400;
		mesh.position.set( radius * Math.sin(theta), 0, radius * Math.cos(theta) )
		mesh.rotation.y = Math.random() * (Math.PI * 2);
		mesh.rotation.x = Math.random() * 0.1 - 0.05;
		mesh.rotation.z = Math.random() * 0.1 - 0.05;
		scene.add(mesh);
		objects.push(mesh);
	}
	
	// sticks
	var numSticks = 70;
	var plane = new THREE.PlaneGeometry( 0.5, 300, 1, 20 );
	for (var i = 0; i < plane.vertices.length; i++) {
		plane.vertices[i].x += Math.sin(plane.vertices[i].y * 0.05) * 4;
	}
	var material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
	for (var i = 0; i < numSticks; i++) {
		var mesh = new THREE.Mesh(plane, material);
		mesh.scale.x = 1 + Math.random() * 0.5;
		mesh.scale.z = 1 + Math.random() * 0.5;
		var theta = Math.random() * Math.PI * 2, radius = Math.random() * 1000 + 100;
		mesh.position.set( radius * Math.sin(theta), 150 + Math.random() * 100, radius * Math.cos(theta) ); 
		mesh.rotation.y = Math.random() * Math.PI;
		scene.add(mesh);
		objects.push(mesh);
	}
}

function butterflyLoaded( geometry ) {
	geometry.computeMorphNormals();
	var material = new THREE.MeshPhongMaterial( { color: 0xf7f660, specular: 0x999999, shininess: 60, morphTargets: true, morphNormals: true, side: THREE.DoubleSide, shading: THREE.SmoothShading } );
	for (var i = 0; i < 4; i++) {
		var mesh = new THREE.MorphAnimMesh( geometry, material );
		mesh.duration = 800;
		mesh.time = Math.random()*mesh.duration;
		mesh.position.set(Math.random()*300 - 150, i*50, -220 + Math.random()*-200);
		var s = 0.5 + Math.random()*0.5;
		mesh.scale.set(s,s,s);
		scene.add( mesh );
		var target = new THREE.Vector3(Math.random()*300 - 150, 250 + Math.random()*100 , -200 + Math.random()*-200);
		var look = new THREE.Vector3();
		var distance = mesh.position.distanceTo(target);
		var speed = distance*0.000000001;
		butterflys.push({mesh: mesh, target: target, time: 0, distance: distance, speed: speed, look: look});
	}
}

function initGrid() {
	var size = 140, step = 10;
	var axisHelper = new THREE.AxisHelper( 15 );
	scene.add( axisHelper );
	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial( { color: 0x303030 } );

	for ( var i = - size; i <= size; i += step ) {
		geometry.vertices.push( new THREE.Vector3( - size, - 0.04, i ) );
		geometry.vertices.push( new THREE.Vector3(   size, - 0.04, i ) );

		geometry.vertices.push( new THREE.Vector3( i, - 0.04, - size ) );
		geometry.vertices.push( new THREE.Vector3( i, - 0.04,   size ) );
	}

	var line = new THREE.LineSegments( geometry, material );
	scene.add( line );
}
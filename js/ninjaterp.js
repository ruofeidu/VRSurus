'use strict';

init();

loader = new THREE.SEA3D({
	autoPlay : true, 	// Auto play animations
	container : scene	// Container to add models
});

loader.onComplete = function( e ) {
	controls = new THREE.OrbitControls( camera );
	animate();
};

loader.load( './models/springer.sea' );

function init() {
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.set( 47, 0.2, -40 );

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x333333, 1 );
	
	container = document.createElement( 'gl' );
	document.body.appendChild( container );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	// post-processing
	/*
	composer = new THREE.EffectComposer( renderer );

	var renderPass = new THREE.RenderPass( scene, camera );
	var copyPass = new THREE.ShaderPass( THREE.CopyShader );
	composer.addPass( renderPass );

	var vh = 1.4, vl = 1.2;

	var colorCorrectionPass = new THREE.ShaderPass( THREE.ColorCorrectionShader );
	colorCorrectionPass.uniforms[ "powRGB" ].value = new THREE.Vector3( vh, vh, vh );
	colorCorrectionPass.uniforms[ "mulRGB" ].value = new THREE.Vector3( vl, vl, vl );
	composer.addPass( colorCorrectionPass );

	var vignettePass = new THREE.ShaderPass( THREE.VignetteShader );
	vignettePass.uniforms[ "darkness" ].value = 1.0;
	composer.addPass( vignettePass );

	composer.addPass( copyPass );
	copyPass.renderToScreen = true;
	*/
	// extra lights
	scene.add( new THREE.AmbientLight( 0xffffff ) );

	// events
	window.addEventListener( 'resize', onWindowResize, false );
}


function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	var delta = clock.getDelta();
	requestAnimationFrame( animate );
	// Update SEA3D Animations
	THREE.SEA3D.AnimationHandler.update( delta );
	// Update Three.JS Animations
	THREE.AnimationHandler.update( delta );
	render( delta );
	stats.update();
}

function render( dlt ) {
	renderer.render( scene, camera );
	//composer.render( dlt );
}
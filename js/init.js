'use strict';
function checkLoading() {
	++g_loadedItems;
	console.log('Loading: ' + g_loadedItems + ' / 8');
}

function initLights() {
	//scene.add( new THREE.AmbientLight( 0xffffff ) );
	scene.add( new THREE.AmbientLight( 0x151c0f ) );
	
	var pLight = new THREE.PointLight( 0xe3fbdc, 0.9 );
	pLight.position.set(1000, 600, 0);
	scene.add(pLight);
	
	var pLight = new THREE.PointLight( 0xf8fbdc, 0.3 );
	pLight.position.set(600, 1000, 0);
	scene.add(pLight);
}

function initPostProcessing() {
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
}

function initCamera() {
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.set( Paras.camera.posX, Paras.camera.posY, Paras.camera.posZ );
}

function initRenderer() {
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x000000, 1 );
	
	container = document.createElement( Paras.canvas.container );
	document.body.appendChild( container );
	container.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
}

function initStat() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
}

function initScene() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xabaf99, 0, 3000);
}

function initVR() {
	vvr.effect = new THREE.VREffect(renderer);
	vvr.controls = new THREE.VRControls(camera);
	vvr.manager = new WebVRManager(renderer, vvr.effect);
	vvr.inited = true; 
}

function initGround(){
	var plane = new THREE.PlaneGeometry(5000, 5000);

	var material = new THREE.MeshBasicMaterial( { color: 0x0f110d, map: THREE.ImageUtils.loadTexture( "images/ground.jpg", undefined, checkLoading ), } );
	material.map.wrapS = THREE.RepeatWrapping;	material.map.wrapT = THREE.RepeatWrapping;
	material.map.repeat.x = 20;	material.map.repeat.y = 20;

	ground = new THREE.Mesh(plane, material);
	ground.rotation.x = -Math.PI * 0.5;
	scene.add(ground);
}

function initTreeButterfly() {
	var loader = new THREE.JSONLoader();
	loader.load( "models/tree.js", treeLoaded );
	//loader.load( "models/butterfly.js", butterflyLoaded );
}

function initSkySphere() {
	var skysphere = new THREE.Mesh(
		new THREE.SphereGeometry(Paras.sky.radius, Paras.sky.widthSegments, Paras.sky.heightSegments),
		new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture( Paras.sky.texFile) })
	);
	skysphere.scale.x = -1; 
	skysphere.material.map.minFilter = THREE.LinearFilter;
	scene.add(skysphere); 
}
	
function init() {
	initScene(); 
	initCamera(); 
	initRenderer(); 
	
	initStat(); 
	
	initSurus(); 
	//initPeasant()
	initGround(); 
	initTreeButterfly(); 
	initSkySphere(); 
	
	initWater(); 
	initFire(); 
	initWind(); 
	
	initLights(); 
	
	initVR(); 
	
	initGUI(); 
}
'use strict';

var ControlParas = function() {
	this.mouseLock			=	true; 
	this.useComposer		=	true; 
}

var SurusPara = function() {
	this.posX		=	0.0; 
	this.posY		=	14.5;
	this.posZ		=	2.0; 
	this.fileName	=	'./models/springer.sea';
	this.meshName	=	'elephant';
	this.initRot	=	0; 
	this.crossFade	=	0.5; 
}

var ScorePara = function() {
	this.relPos		=	new THREE.Vector3(19.9, 19.9, -19.9);
	this.pos		=	new THREE.Vector3(); 
}

var PeasantPara = function() {
	this.fileName	=	'./models/peasant.sea';
	this.initTime	=	3000; 
	this.dieTime	=	1500; 
	this.spawnTime	=	4000; 
}

var FactoryPara = function() {
	this.fileName	=	'./models/factory.sea'; 
	this.initTime	=	7000; 
	this.spawnTime	=	6000; 
	this.dieTime	=	1500; 
	this.buildTime	=	7750; 
	this.buildSpeed	=	3.0; 
	this.height		=	-45; 
	this.scale		=	5; 
}

var GarbagePara = function() {
	this.count = 4; 
	this.fileNames	=	['./models/garbage0.sea', './models/garbage1.sea', './models/garbage2.sea', './models/garbage3.sea']; 
	this.spawnTime	=	1000; 
	this.spawnLeft	=	1; 
	this.dieTime	=	1500; 
}

var CameraPara = function() {
	this.posX	 	=   0.0; 
	this.posY	 	= 	26.0; 
	this.posZ	 	= 	0.0; 
	this.theta		=	-Math.PI/2; 
}

var CanvasPara = function() {
	this.container	=	'gl'; 
}

var RenderPara = function() {
	this.postprocessing = false; 
}

var StarPara = function() {
	this.count		=	6; 
	
}

var SkyPara = function() {
	this.radius			=	2000; 
	this.widthSegments	=	8; 
	this.heightSegments	=	8; 
	this.texFile		=	'images/cloudsphere.jpg'; 
}

var Parameters = function() {
	this.debugMode = true; 
	this.control = new ControlParas(); 
	this.surus = new SurusPara(); 
	this.camera = new CameraPara(); 
	this.canvas = new CanvasPara(); 
	this.render = new RenderPara();
	this.sky = new SkyPara(); 
	this.factory = new FactoryPara(); 
	this.peasant = new PeasantPara(); 
	this.garbage = new GarbagePara(); 
	this.score = new ScorePara(); 
	this.star = new StarPara(); 
}

var Paras = new Parameters(); 
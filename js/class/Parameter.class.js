'use strict';

var VideoParas = function() {
	this.singleMode			=	true; 
	this.numVideos			=	2; 
	this.aspect				=	1.77777777777778; 
	this.numShownVideos		=	this.numVideos; 
	this.fileName			=	"LightField_1620p_25fps.webm"; 
}

var ControlParas = function() {
	this.mouseLock			=	true; 
	this.useComposer		=	true; 
}

var SpringerPara = function() {
	this.posY		=	14.5;
	this.fileName	=	'./models/springer.sea';
	this.meshName	=	'elephant';
	this.crossFade	=	0.5; 
}

var CameraPara = function() {
	this.posX	 	= 	0.0; 
	this.posY	 	= 	50.0; 
	this.posZ	 	= 	-25.0; 
}

var CanvasPara = function() {
	this.container	=	'gl'; 
}

var RenderPara = function() {
	this.postprocessing = false; 
}

var Parameters = function() {
	this.video = new VideoParas(); 
	this.control = new ControlParas(); 
	this.springer = new SpringerPara(); 
	this.camera = new CameraPara(); 
	this.canvas = new CanvasPara(); 
	this.render = new RenderPara();
}

var Paras = new Parameters(); 
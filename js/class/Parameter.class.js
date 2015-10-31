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
	this.crossFade	=	0.5; 
}

var CameraPara = function() {
	this.posX	 	=   0.0; 
	this.posY	 	= 	26.0; 
	this.posZ	 	= 	0.0; 
}

var CanvasPara = function() {
	this.container	=	'gl'; 
}

var RenderPara = function() {
	this.postprocessing = false; 
}

var SkyPara = function() {
	this.radius			=	2000; 
	this.widthSegments	=	32; 
	this.heightSegments	=	32; 
	this.texFile		=	'images/cloudsphere.jpg'; 
}

var Parameters = function() {
	this.control = new ControlParas(); 
	this.surus = new SurusPara(); 
	this.camera = new CameraPara(); 
	this.canvas = new CanvasPara(); 
	this.render = new RenderPara();
	this.sky = new SkyPara(); 
}

var Paras = new Parameters(); 
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

var Parameters = function() {
	this.video = new VideoParas(); 
	this.control = new ControlParas(); 
}

var Paras = new Parameters(); 
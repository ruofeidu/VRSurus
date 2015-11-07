'use strict';
/**
 * Global variables
 * This is not a good habit, please avoid defining so many global variables in your project :-) 
 * @author Ruofei Du
 */
// Three.js
var container, stats, camera, scene, renderer, composer, controls, manager, sceneOrtho, cameraOrtho;

var g_loadedItems = 0, objects = [], trees = [], garbage = [], stars = [], butterflys = [];
var surus, ground, peasant, factory, debugBall;
var water = {}, fire = {}, wind = {}, smoke = {};
var audio = {}, game = {}, score = {}, tto = {}, instruction = {};
var signals = {
	ch : 'a',
	lock : false,
	inputLock : false,
	outputLock : false,
	inputString : 'I', 
	outputString : 'I', 
	fakeString : 'I',
}
// shaderToy
var isMouseDown = false, mousePos = {x:0, y:0, z:0, w:0};
var startTime = new Date() / 1000;
var clock = new THREE.Clock();
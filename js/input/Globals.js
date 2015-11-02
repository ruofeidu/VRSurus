'use strict';
// Three.js
var container, stats, camera, scene, renderer, composer, controls, manager;

var g_loadedItems = 0, objects = [], trees = [], garbage = [], stars = [];
var surus, ground, peasant, factory, debugBall;
var water = {}, fire = {}, wind = {};
var audio = {}, game = {}, score = {};

// shaderToy
var isMouseDown = false, mousePos = {x:0, y:0, z:0, w:0};
var startTime = new Date() / 1000;
var clock = new THREE.Clock();
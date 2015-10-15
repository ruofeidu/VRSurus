'use strict';
// Three.js
var container, stats;
var camera, scene, renderer, composer, controls;
var loader;
// shaderToy
var isMouseDown = false, mousePos = {x:0, y:0, z:0, w:0};
var startTime = new Date() / 1000;
var clock = new THREE.Clock();
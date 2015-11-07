'use strict';

var padNames = [
	'leftStick',
	'rightStick',
	'faceButton0',	// A
	'faceButton1', 	// B
	'faceButton2',  // X
	'faceButton3',  // Y
	'leftShoulder0',  // LB
	'rightShoulder0', // RB
	'leftShoulder1',  // LT
	'rightShoulder1',  // RT
	'select', 			// BACK
	'start',			// START
	'leftStickButton',	
	'rightStickButton',
	'dpadUp',
	'dpadDown',
	'dpadLeft',
	'dpadRight'
];

var padState = {
	btnSelect	:	false,
	btnStart	:	false,
	btnLB		:	false,
	btnRB		:	false,
	btnLT		:	false,
	btnLT		:	false,
	btnA		:	false,
	btnB		:	false,
	btnX		:	false,
	btnY		:	false,
	btnLSB		:	false,
	btnRSB		:	false,
	dpadUp		:	false,
	dpadDown	:	false,
	dpadLeft	:	false,
	dpadRight	:	false,
}

function updateGamepad() {
	window.requestAnimationFrame(updateGamepad);

	var pads = Gamepad.getStates();
	for (var i = 0; i < pads.length; ++i) {
		var pad = pads[i];
		if (pad) {
			if (pad['faceButton0'].pressed) {
				if (!padState.btnA) {
					signalSpray(); 
				}
			}
			
			if (pad['faceButton1'].pressed) {
				if (!padState.btnB) {
					signalThrust(); 
				}
			}
			
			if (pad['faceButton2'].pressed) {
				if (!padState.btnX) {
					signalSlapLeft(); 
				}
			}
			
			if (pad['faceButton3'].pressed) {
				if (!padState.btnY) {
					signalSlapRight(); 
				}
			}
			
			if (pad['select'].pressed) {
				if (!padState.btnSelect) {
					console.log('fuck'); 					game.start(); 
				}
			}
			
			if (pad['start'].pressed) {
				if (!padState.btnStart) {
					console.log('fuck'); 
					padState.btnStart = true; 
					game.tutorial(); 
				}
			}
			
			//padState.btnSelect = pad['select'].pressed;
			//padState.btnStart = pad['start'].pressed;
			padState.btnLB = pad['leftShoulder0'].pressed;
			padState.btnLT = pad['leftShoulder1'].pressed;
			padState.btnRB = pad['rightShoulder0'].pressed;
			padState.btnRT = pad['rightShoulder1'].pressed;
			padState.btnA = pad['faceButton0'].pressed;
			padState.btnB = pad['faceButton1'].pressed;
			padState.btnX = pad['faceButton2'].pressed;
			padState.btnY = pad['faceButton3'].pressed;
			padState.btnLSB = pad['leftStickButton'].pressed;
			padState.btnRSB = pad['rightStickButton'].pressed;			
			padState.dpadUp = pad['dpadUp'].pressed;
			padState.dpadDown = pad['dpadDown'].pressed;
			padState.dpadLeft = pad['dpadLeft'].pressed;
			padState.dpadRight = pad['dpadRight'].pressed;
		} 
	}
}

if (Gamepad.supported) {
	updateGamepad();
}
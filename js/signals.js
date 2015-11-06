'use strict';
/**
 * Signal Transmission
 * @author Ruofei Du
 */

/**
 * This function is used for debugging purpose to mimic signal transmission via keyboard or XBOX 360
 */
function setFakeInput(fakeString) {
	if (!signals.inputLock) {
		signals.inputLock = true; 
		$.ajax( {url: (Paras.signal.baseURL + '?setInput=' + fakeString) , success: function (){
				signals.inputLock = false; 
			}, error: function() { 
				signals.inputLock = false; 
			}   
		});
	}
}

/**
 * Left slap
 */
function actionSlapLeft() {
	if (surus.curState !== SURUS_SLAP_LEFT)	{
		surus.slapLeft(); 
		surus.scanEnemy(surus.getOrientation());
	}		
}

function signalSlapLeft() {
	if (Paras.signal.fakeInput)	setFakeInput('L128'); else actionSlapLeft(); 
}

/**
 * Right slap
 */
function actionSlapRight() {
	if (surus.curState !== SURUS_SLAP_RIGHT)	{
		surus.slapRight(); 
		surus.scanEnemy(surus.getOrientation()); 
	}		
}

function signalSlapRight() {
	if (Paras.signal.fakeInput)	setFakeInput('R128'); else actionSlapRight(); 
}

/**
 * Spray water
 */
function actionSpray() {
	if (surus.curState !== SURUS_SPRAY) {
		surus.spray(); 
		surus.scanEnemy(surus.getOrientation()); 
	}
}

function signalSpray() {
	if (Paras.signal.fakeInput)	setFakeInput('S128'); else actionSpray(); 
}

/**
 * Thrust
 */
function actionThrust() {
	if (surus.curState !== SURUS_THRUST) {
		surus.thrust(); 
		surus.scanEnemy(surus.getOrientation()); 
	}
}

function signalThrust() {
	if (Paras.signal.fakeInput)	setFakeInput('T128'); else actionSpray(); 
}

/**
 * Update signals
 */
function updateSignals() {
	if (!signals.lock) {
		//console.log('update signals');
		signals.lock = true; 
		$.ajax({url:(Paras.signal.baseURL + '?getInputSetOuptut=' + signals.outputString) , success:function(result){
				signals.inputString = result;
				var c = signals.inputString.charAt(0);
				var val = parseInt(signals.inputString.substring(1)); 
				if (c === 'L') {
					actionSlapLeft(); 
				} else
				if (c === 'R') {
					actionSlapRight(); 
				} else
				if (c === 'S') {
					actionSpray(); 
				} else
				if (c === 'T') {
					actionThrust(); 
				}
				signals.lock = false; 
			}, error: function() { 
				signals.lock = false; 
			}   
		});
	}
}

/*
function getInput() {
	if (!signals.inputLock) {
		$.ajax({url:(Paras.signal.baseURL + '?getInput=1') , success:function(){
				signals.inputLock = false; 
			}, error: function() { 
				signals.inputLock = false; 
			}   
		});
	}
}

function setOutput() {
	if (!signals.outputLock) {
		$.ajax({url:(Paras.signal.baseURL + '?setOutput=' + signals.outputString) , success:function(result){
				signals.inputString = result;
				signals.outputLock = false; 
			}, error: function() { 
				signals.outputLock = false; 
			}   
		});
	}
}
*/
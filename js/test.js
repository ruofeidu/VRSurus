'use strict';

function animate() {
	requestAnimationFrame( animate );
	if (signals.start) updateSignals(); 
}

var signals = {
	ch : 'a',
	start : false,
	lock : false,
	inputLock : false,
	outputLock : false,
	inputString : 'I', 
	outputString : 'I', 
	fakeString : 'I',
}

function updateSignals() {
	if (!signals.lock) {
		signals.lock = true; 
		$.ajax({url:(Paras.signal.baseURL + '?getInputSetOuptut=' + signals.outputString) , success:function(result){
				signals.inputString = result;
				$('#input').html('Input:' + result); 
				$('#output').html('Output:' + signals.outputString); 
				signals.lock = false; 
			}, error: function() { 
				signals.lock = false; 
			}   
		});
	}
}


$( document ).ready(function() {
    console.log( "Running VRSurus Test, a NinjaTerp product by Ruofei Du and Liang He at UMD." );
	$('#start').click(function() {
		signals.start = !signals.start; 
	});
	$('.opt').click(function() {
		signals.outputString = this.id; 
	});
	
	animate();
});
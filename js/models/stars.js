'use strict';
function initStars() {
	
	var geo = new THREE.PlaneGeometry( 15, 15, 10, 10 );
	var tex = THREE.ImageUtils.loadTexture('images/star.png'); 
	
	for (var i = 0; i < Paras.star.count; ++i) {
		var mat = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.5, side: THREE.DoubleSide, map: tex, opacity : 1.0  }); 
		var mesh = new THREE.Mesh(geo, mat);
		mesh.position.set(100, 30, 100); 
		
		stars.push(mesh); 
		stars[i].blinking = false; 
		scene.add(mesh); 
		stars[i].visible = false; 
	}	
}

function starBlink(i, pos) {
	if (i === undefined) return; 
	if (pos === undefined) pos = stars[i].position; 
	if (stars[i].blinking) return; 
	stars[i].blinking = true; 
	stars[i].goUp = true; 
	stars[i].opacity = 0.0; 
	stars[i].visible = true; 
	stars[i].position.copy(pos); 
	stars[i].position.y  = 26; 
	stars[i].lookAt( camera.position ); 
}

function starsUpdate() {
	for (var i = 0; i < Paras.star.count; ++i) if (stars[i].blinking) {
		if (stars[i].goUp) {
			stars[i].opacity += 0.1; 
			if (stars[i].opacity >= 1.0) {
				stars[i].opacity = 1.0; 
				stars[i].goUp = false; 
			}
			stars[i].position.y += stars[i].opacity * 10; 
		} else {
			stars[i].opacity -= 0.1; 
			stars[i].position.y -= stars[i].opacity * 10; 
			if (stars[i].opacity <= 0.0) {
				stars[i].blinking = false; 
				stars[i].visible = false; 
			}
		}
	}
}

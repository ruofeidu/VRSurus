var X_AXIS	=	new THREE.Vector3(1, 0, 0);
var Z_AXIS	=	new THREE.Vector3(0, 0, 1);
var Y_AXIS	=	new THREE.Vector3(0, 1, 0);
var WHITE_COLOR	=	0xffffff;
var PI = 3.1415926535898;
var PI_2 = PI / 2;
const SURUS_IDLE = 0, SURUS_SLAP_LEFT = 1, SURUS_SLAP_RIGHT = 2, SURUS_SPRAY = 3, SURUS_THRUST = 4; 

THREE.Utils = {
    cameraLookDir: function(camera) {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(camera.rotation, camera.eulerOrder);
        return vector;
    }
};

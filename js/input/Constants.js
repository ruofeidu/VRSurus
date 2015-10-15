var X_AXIS	=	new THREE.Vector3(1, 0, 0);
var Z_AXIS	=	new THREE.Vector3(0, 0, 1);
var Y_AXIS	=	new THREE.Vector3(0, 1, 0);
var WHITE_COLOR	=	0xffffff;
var PI = 3.1415926535898;
var PI_2 = PI / 2;
var DMS = 4;

THREE.Utils = {
    cameraLookDir: function(camera) {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(camera.rotation, camera.eulerOrder);
        return vector;
    }
};
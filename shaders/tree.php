<script id="vs_tree" type="x-shader/x-vertex">
uniform float globalTime;

varying vec2 vUv;
varying float vDarken;
varying vec2 shadowUv;

void main() {

	vUv = uv*2.0;

	vDarken = min( max( 0.35, (position.y-10.0)/10.0 ), 1.5);

	vec3 animated = position;

	animated.x += sin(position.z*1.4+globalTime)*0.25;
	animated.z += cos(position.x*1.8+globalTime)*0.25;

	vec4 mvPosition = modelViewMatrix * vec4( animated, 1.0 );
	
	gl_Position = projectionMatrix * mvPosition;

	vec2 size = vec2(36.0, 36.0);
	shadowUv = vec2((position.x+cos(position.z*1.4+globalTime)*2.85)/size.x, (position.z+sin(position.x*1.8+globalTime)*2.85)/size.y)*1.0;
}
</script>

<script id="fs_tree" type="x-shader/x-fragment">
uniform sampler2D map;
uniform vec3 color;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

varying vec2 vUv;
varying float vDarken;
varying vec2 shadowUv;

uniform sampler2D shadow;
uniform float globalTime;


void main() {

	vec4 tex = texture2D( map, vUv );

	if (tex.w <= 0.55) {
		discard;
	} else {

	float depth = gl_FragCoord.z / gl_FragCoord.w;
	float fogFactor = smoothstep( fogNear, fogFar, depth );

	vec4 shd = texture2D( shadow, shadowUv+vUv );
	float shadowAdd = 1.0;

	if (shd.x < 0.5) {
		shadowAdd = shd.x+vDarken;
	}

	gl_FragColor = vec4( tex.xyz*color*shadowAdd*vDarken, 1.0);
	vec4 color = mix( gl_FragColor, vec4( fogColor, 1.0 ), fogFactor );
	gl_FragColor = vec4( color.xyz , tex.w );
	}
}
</script>

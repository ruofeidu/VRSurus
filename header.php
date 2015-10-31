<!doctype html>
<html lang="en">
<!--
 Developer: Ruofei Du (Graphics) and Liang He (Hardware)
 Research Question: What if the dual worlds of playing and learning are seamlessly coupled in a tangible virtual reality setting? 
 Title: NatureRescuer: A Tangible Serious Game for Education on Water Conservation
 Abstract: We propose NatureRescuer, a tangible serious game that aims to inspire children to protect the environment in immersive virtual reality. NatureRescuer is to be built upon a physical puppet and a VR display (Oculus Rift). With gyroscope, accelerometer, compass and other sensors, the puppet is to be put on by the player to travel through the game. Servos will assist with the puppet animation visible to the audience and provide haptic feedback for the user. We propose two gaming scenarios: a giraffe races against a worker who is cutting down trees which shows how the struggle animals have when their environment is destroyed, or an elephant runs to collect rain drops and destroys factories that produce polluted water. We hope NatureRescuer will educate children in water or forest conservation.
 Website: http://duruofei.com http://lianghe.me
 Creative Common v3.0 License
 University of Maryland, College Park
-->
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	<title>Springer: A Tangible Serious Game for Education on Water Conservation</title>
	<link rel="stylesheet" href="css/jquery-ui.css" />
	<link rel="stylesheet" href="css/ninjaterp.css" />
	<script type="text/javascript" src="js/lib/dat.gui.min.js"></script>
	<script type="text/javascript" src="js/lib/jquery-1.11.3.min.js"></script>
	<script type="text/javascript" src="js/lib/jquery-ui.min.js"></script>
	<script type="text/javascript" src="js/lib/three.min.js"></script>
	<script type="text/javascript" src="js/lib/three.extra.js"></script>
	<script type="text/javascript" src="js/lib/stats.min.js"></script>
	<script type="text/javascript" src="js/shaders/CopyShader.js"></script>
	<script type="text/javascript" src="js/shaders/ColorCorrectionShader.js"></script>
	<script type="text/javascript" src="js/shaders/VignetteShader.js"></script>
	<script type="text/javascript" src="js/shaders/ConvolutionShader.js"></script>
	<script type="text/javascript" src="js/postprocessing/EffectComposer.js"></script>
	<script type="text/javascript" src="js/postprocessing/RenderPass.js"></script>
	<script type="text/javascript" src="js/postprocessing/ShaderPass.js"></script>
	<script type="text/javascript" src="js/postprocessing/MaskPass.js"></script>
	<script type="text/javascript" src="js/postprocessing/BloomPass.js"></script>
	<script type="text/javascript" src="js/controls/OrbitControls.js"></script>
	<script type="text/javascript" src="js/loaders/sea3d/SEA3D.js"></script>
	<script type="text/javascript" src="js/loaders/sea3d/SEA3DLZMA.js"></script>
	<script type="text/javascript" src="js/loaders/sea3d/SEA3DLoader.js"></script>
	<script type="text/javascript" src="js/lib/mousetrap.min.js"></script>
	
	<script type="text/javascript" src="js/lib/vr/webvr-polyfill.js"></script>
	<script type="text/javascript" src="js/lib/vr/VRControls.js"></script>
	<script type="text/javascript" src="js/lib/vr/VREffect.js"></script>
	<script type="text/javascript" src="js/lib/vr/webvr-manager.js"></script>
</head>
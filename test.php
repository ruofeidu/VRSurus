<?php
/**
 * Developer: Ruofei Du (Graphics) and Liang He (Hardware)
 * Research Question: What if the dual worlds of playing and learning are seamlessly coupled in a tangible virtual reality setting? 
 * Title: NatureRescuer: A Tangible Serious Game for Education on Water Conservation
 * Abstract: We propose NatureRescuer, a tangible serious game that aims to inspire children to protect the environment in immersive virtual reality. NatureRescuer is to be built upon a physical puppet and a VR display (Oculus Rift). With gyroscope, accelerometer, compass and other sensors, the puppet is to be put on by the player to travel through the game. Servos will assist with the puppet animation visible to the audience and provide haptic feedback for the user. We propose two gaming scenarios: a giraffe races against a worker who is cutting down trees which shows how the struggle animals have when their environment is destroyed, or an elephant runs to collect rain drops and destroys factories that produce polluted water. We hope NatureRescuer will educate children in water or forest conservation.
 * Website: http://duruofei.com http://lianghe.me
 * Creative Common v3.0 License
 * University of Maryland, College Park
 */
include "header.php";
?>
<body>
	<div id="start" style="color:#FFFFFF; size=20pt">Start / Pause</div>
	<div class="opt" id="I" style="color:#FFFFFF; size=20pt">Output I</div>
	<div class="opt" id="128,0,0,0" style="color:#FFFFFF; size=20pt">Output V128</div>
	<div class="opt" id="0,1,0,0" style="color:#FFFFFF; size=20pt">Output L1</div>
	<div class="opt" id="0,0,1,0" style="color:#FFFFFF; size=20pt">Output R1</div>
	<div class="opt" id="0,0,0,128" style="color:#FFFFFF; size=20pt">Output S128</div>
	<div class="opt" id="128,0,0,128" style="color:#FFFFFF; size=20pt">Output V128S128</div>
	<div class="opt" id="255,1,1,255" style="color:#FFFFFF; size=20pt">Output V255L1R1S255</div>
	
	<div id="input" style="color:#FFFFFF">Input: </div>
	<div id="output" style="color:#FFFFFF">Output: </div>
	
	<script type="text/javascript" src="js/class/Parameter.class.js"></script>
	<script type="text/javascript" src="js/test.js"></script>
</body>
</html>
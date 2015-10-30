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
include "shaders/tree.php";

/*
include "shader/lightfield-vs.php";
include "shader/lightfield-fs.php";
include "shader/loading-vs.php";
include "shader/loading-fs.php";
*/
include "body.php";
?>
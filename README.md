# VRSurus: A Tangible Virtual-Reality Game for Environmental Protection

### Introduction
We introduce VRSurus, a tangible serious game that aims to inspire children to protect the environment in immersive virtual reality (VR). VRSurus is built upon a physical puppet and a VR head-mounted display (Oculus Rift DK2) to create "tangible virtual animatronics". The player will act as a little elephant called Surus to prevent evil humanbeings from invading the forest. The player is able to use four gestures to cast magical spells: swiping left, swiping right, shaking and jumping. Servos, selonoids and vibration motors will assist with the puppet animation visible to the audience and provide haptic feedback for the player. VRSurus contributes to the HCI, animatronics and tangible computing community by integrating immersive interactive graphics together with gesture recognition and tangible feedback. The game is presented at the UIST 2015 Student Innovation Contest. Video and more details will be publicly available via www.vrsurus.com.

### Story Background
Once upon a time, there was a little elephant named Surus, living happily in a beautiful forest - Green Woodland.
However, in a cloudy day, evil human beings started to invade Green Woodland. They threw garbage everywhere; they used axes to cut down green trees; they even started to construct factories to pollute the air!
The magical elf of Green Woodland assigned you, Surus, to save the forest and rescue the nature! Surus is empowered with the magic of wind, water and fire to destroy the messy garbage, evil lumbermen and destructive factories. 

### Technical Brief
The software is built with WebGL and WebVR, which enables the game to be cross-platform for Oculus Rift and Google Cardboard. We rendered photo-realistic forest environment, GPU-based particle effects as well as skeleton-animated elephants, lumberman and factory. We use HTML5 (WebGL, WebVR, 3D Audio API), Javascript (jQuery & Three.js), GLSL ES (WebGL), PHP (ThinkPHP), MySQL and Java (Processing) to implement the entire system. 

The hardware consists of gyroscope, accelerometer, compass, servos, vibration motors, selonoids, batteries, 3D-printed skeletons and cases. 

### Authors
We the NinjaTerp team! Feel free to visit VRSurus.com for more information!
* Ruofei Du (http://duruofei.com)
   *  [Augmentarium Lab] | [UMIACS] | [University of Maryland, College Park]
   * Team Captain, Graphics (WebGL + WebVR + Model + 3D Audio) and Web Server (PHP + MySQL + Part of Java)
* Liang He (http://lianghe.me)
   * Makeability Lab | [HCIL] | [UMIACS] | [University of Maryland, College Park] 
   * Fabrication (3D Modeling, Printing), Logo, Video and Hardware (Arduino, Java)

### Advisor
* Amitabh Varshney (http://www.cs.umd.edu/~varshney)

### Presentation
The game is presented on UIST 2015 Student Innovation Contest. The project is still work-in-progress for future publications. For now, please cite
> Du, R., He, L., Varshney, A. VRSurus: A Tangible Virtual-Reality Game for Environmental Protection. (2015) UIST 2015 Student Innovation Contest. http://vrsurus.com

If you find our idea or code useful for your projects.

### How to Use
Feel free to run the entire codebase or build partial code such as only the VR game or only the open-sourced hardware.

##### VRSurus Game
The game is running a webserver with WebGL and WebVR technologies. Here is a step-by-step tutorial:
* Install [XAMPP] to setup a PHP + Apache + MySQL environment.
* Run Apache and MySQL server.
* Clone the git reporsitory and place all code into the XAMPP folder under htdocx/ninjaterp
* Open http://localhost/PHPMyAdmin, Create a new table called vrsurus and import the MySQL data from server/mysql/mysql.sql into the vrsurus table.
* Download the [Oculus Runtime] (v0.6.1 tested, v0.8 should also work) and [Chromium build for WebVR]
* Run http://localhost/ninjaterp using [Chromium build for WebVR]
* Press space on the keyboard to start the tutorial, press enter on the keyboard to start the game.
* You can control Surus using three ways:
    * Keyboard: 1, 2, 3, 4.
    * XBox: A, B, X, Y.
    * Puppet: Swipe left, swipe right, shake, thrust.

If you start the game and observe the scene flying high into the sky, then probably you are not using the correct browser: [Chromium build for WebVR]
### Instructions
##### Gecture
Please close the mouth of the puppet when performing any gesture to attack enemies. Then open the mouth.

##### Wind Spells
Swipe leftward or rightward to clean the garbage.

##### Water Spell
Shake the nose up and down to sweep the lumberman(an) away

##### Fire Spell
Punch forward to destroy the evil factories.

### Code
[Code on Github]

### Technical Challenges
This project is realy ambitious. We iterate numerous times, tried and failed in both software and hardware: anmiated models & 3D printing & miniaturization. 

### Acknowledgement
The authors would like to thank [Sai Yuan] from Department of Animal and Avian Science of [University of Maryland, College Park] for helping with splendid sewing and awesome vocal, background music and audio effects. We also thank 3DRT.com for providing a student discount for the awesome 3D models. And, thanks to [Augmentarium Lab] for funding this project.

### License
Creative Commons  Attribution-NonCommercial 4.0 International 

### Version
1.0.0

[Code on Github]: https://github.com/animatronics/ninjaterp
[Augmentarium Lab]:http://augmentarium.umiacs.umd.edu
[GVIL]:http://www.cs.umd.edu/gvil/
[HCIL]:http://www.cs.umd.edu/hcil/
[UMIACS]:http://umiacs.umd.edu
[University of Maryland, College Park]:http://www.umd.edu
[XAMPP]: https://www.apachefriends.org/index.html
[Oculus Runtime]: https://developer.oculus.com/downloads/pc/0.6.0.1-beta/Oculus_Runtime_for_Windows/
[Chromium build for WebVR]: https://drive.google.com/folderview?id=0BzudLt22BqGRbW9WTHMtOWMzNjQ
[Sai Yuan]: http://veritayuan.com/
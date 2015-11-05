# VRSurus: A Tangible Virtual-Reality Game for Environmental Protection

### Authors
We the NinjaTerp team!
* Ruofei Du (http://duruofei.com)
   *  [Augmentarium Lab] | [UMIACS] | [University of Maryland, College Park]
   * Team Captain, Graphics (WebGL + WebVR + Model + Audio) and Web Server (PHP + MySQL + Part of Java)
* Liang He (http://lianghe.me)
   * Makeability Lab | [HCIL] | [UMIACS] | [University of Maryland, College Park] 
   * Fabrication (3D Modeling, Printing), Logo, Video and Hardware (Arduino, Java)

### Advisor
* Amitabh Varshney (http://www.cs.umd.edu/~varshney)

### Presentation
The game is presented on UIST 2015 Student Innovation Contest. The project is still work-in-progress for future publications. For now, please cite
> Du, R., He, L., Varshney, A. VRSurus: A Tangible Virtual-Reality Game for Environmental Protection. (2015) UIST 2015 Student Innovation Contest. http://vrsurus.com

If you find our idea or code useful for your projects.

### Introduction
We introduce VRSurus, a tangible serious game that aims to inspire children to protect the environment in immersive virtual reality (VR). VRSurus is built upon a physical puppet and a VR display (including Oculus Rift DK2 and Google Cardboard). Our hardware can be put on any puppet to recognize four kinds of gestures: swiping left, swiping right, shaking and jumping. In our gaming scenario, the four gestures correspond to four actions in the VR game: left-slapping, right-slapping, spraying and thrusting.

The software is built via WebGL and WebVR, which enables the game to be cross-platform for Oculus Rift and Google Cardboard. We rendered photo-realistic forest environment, GPU-based particle effects as well as animated elephants, farmers and factories.

The hardware consists of gyroscope, accelerometer, compass and servos.  The puppet is to be put on by the player to travel through the game. Servos will assist with the puppet animation visible to the audience and provide haptic feedback for the user. 

### Story Background
Once upon a time, there was a little elephant named Surus, living happily in a beautiful forest - Pal Woodland.

However, in a cloudy day, evil human beings started to invade Pal Woodland. They threw garbage everywhere; they used axes to cut down green tree; they even started to construct factories to pollute the air!

The magical elf of Pal Woodland assigned you, Surus, to save the forest and rescue the nature! Surus is empowered with the magic of fire, water and wind to destroy the messy garbage, evil lumbermen and destructive factories. 

Game instructions: When garbage appears, swipe left or right to create magic of wind to clear them; when lumberman appears, shake the nose to spray water at them; when the factory is being constructed, move the puppet forward to throw fire to destroy it.

### How to Use
Feel free to run the entire codebase or build partial code such as only the VR game or only the open-sourced hardware.

##### VRSurus Game
The game is running a webserver with WebGL and WebVR technologies. Here is a step-by-step tutorial:
* Install [XAMPP] to setup a PHP + Apache + MySQL environment.
* Run Apache and MySQL server.
* Clone the git reporsitory and place all code into the XAMPP folder under htdocx/ninjaterp.
* Open http://localhost/PHPMyAdmin, Build a table called vrsurus and import the MySQL data from server/mysql/mysql.sql into the vrsurus table.
* Download the [Oculus Runtime] (v0.6.1 tested, v0.8 should also work) and [Chromium build for WebVR]
* Run http://localhost/ninjaterp using [Chromium build for WebVR]
* Press space on the keyboard to start the tutorial, press enter on the keyboard to start the game.
* You can control Surus using three ways:
    * Keyboard: 1, 2, 3, 4.
    * XBox: A, B, X, Y.
    * Puppet: Swipe left, swipe right, shake, thrust.

### Code
[Code on Github]

### License
Creative Commons  Attribution-NonCommercial 4.0 International 

### Version
1.0.0

[Code on Github]: https://github.com/animatronics/UIST2015_Fantasia
[Augmentarium Lab]:http://augmentarium.umiacs.umd.edu
[GVIL]:http://www.cs.umd.edu/gvil/
[HCIL]:http://www.cs.umd.edu/hcil/
[UMIACS]:http://umiacs.umd.edu
[University of Maryland, College Park]:http://www.umd.edu
[XAMPP]: https://www.apachefriends.org/index.html
[Oculus Runtime]: https://developer.oculus.com/downloads/pc/0.6.0.1-beta/Oculus_Runtime_for_Windows/
[Chromium build for WebVR]: https://drive.google.com/folderview?id=0BzudLt22BqGRbW9WTHMtOWMzNjQ
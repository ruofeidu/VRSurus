#include <Servo.h>

Servo myservo;  // create servo object to control a servo


int val;    // variable to read the value from the analog pin

void setup()
{
  myservo.attach(6);  // attaches the servo on pin 6 to the servo object
}

void loop() 
{ 
  val = random(0,1023);
  val = map(val, 0, 1023, 0, 180);     // scale it to use it with the servo (value between 0 and 180) 
  myservo.write(val);                  // sets the servo position according to the scaled value 
  delay(1000);                           // waits for the servo to get there 
} 


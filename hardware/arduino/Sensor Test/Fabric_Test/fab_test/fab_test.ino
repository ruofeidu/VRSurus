#include <CapacitiveSensor.h>
 
CapacitiveSensor   cs_9_10 = CapacitiveSensor(9,10);        // 10M resistor between pins 4 & 2, pin 2 is sensor pin, add a wire and or foil if desired
void setup()                    
{
   cs_9_10.set_CS_AutocaL_Millis(0xFFFFFFFF);     // turn off autocalibrate on channel 1 - just as an example

   Serial.begin(9600);
}
 
void loop()                    
{
    long total1 =  cs_9_10.capacitiveSensor(30);
    //long total2 =  cs_9_2.capacitiveSensor(30);
    //long total3 =  cs_4_8.capacitiveSensor(30);
 
    Serial.println(total1);                  // print sensor output 1
    //Serial.print("\t");
    //Serial.println(total2);                  // print sensor output 2
    //Serial.print("\t");
    //Serial.println(total3);                // print sensor output 3
 
    delay(10);                             // arbitrary delay to limit data to serial port 
}


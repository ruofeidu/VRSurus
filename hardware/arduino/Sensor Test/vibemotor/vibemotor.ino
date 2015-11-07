#define fadePin 5

void setup(){
  pinMode(fadePin, OUTPUT);  
}

void loop(){

    //int val = random(0,255);
    analogWrite(fadePin, 0);

    delay(200);
  


}

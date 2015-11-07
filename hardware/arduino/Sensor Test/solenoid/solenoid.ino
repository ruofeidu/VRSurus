#define fadePin 4
//#define fadePin 2

int count = 0;
void setup(){
  pinMode(fadePin, OUTPUT);  
}

void loop(){

  digitalWrite(fadePin, HIGH);
  
  delay(50);
  digitalWrite(fadePin, LOW);
  delay(400);
}

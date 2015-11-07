#include <SPI.h>
#include <Mirf.h>
#include <nRF24L01.h>
#include <MirfHardwareSpiDriver.h>

int accel_x, accel_y, accel_z;

void setup(){
  Serial.begin(9600);
  Mirf.spi = &MirfHardwareSpi;
  Mirf.init();

  Mirf.setRADDR((byte *)"serv1");

  Mirf.payload = 9;
  
  Mirf.config();

}

void loop(){

  byte data[Mirf.payload];
  

  if(!Mirf.isSending() && Mirf.dataReady()){
    
    Mirf.getData(data);
   
    // Mirf.setTADDR((byte *)"clie1");
    // Mirf.send(data);
    
    accel_x = data[1];
    accel_x = accel_x << 8 | data[2];
    if(data[0] == '-'){
      accel_x = -accel_x;
    }

    accel_y = data[4];
    accel_y = accel_y << 8 | data[5];
    if(data[3] == '-'){
      accel_y = -accel_y;
    }

    accel_z = data[7];
    accel_z = accel_z << 8 | data[8];
    if(data[6] == '-'){
      accel_z = -accel_z;
    }
    printData();
    
  }
  //printdata();
}

void printdata(void){
  Serial.print("Acc: ");
  Serial.print(accel_x);
  Serial.print(", ");
  Serial.print(accel_y);
  Serial.print(", ");
  Serial.println(accel_z);
}
void printData(void){
  Serial.print(accel_x);
  Serial.print(',');
  Serial.print(accel_y);
  Serial.print(',');
  Serial.print(accel_z);
  Serial.print('#');
}

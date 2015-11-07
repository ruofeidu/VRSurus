#include <SPI.h>
#include <Mirf.h>
#include <MirfHardwareSpiDriver.h>
#include <MirfSpiDriver.h>
#include <nRF24L01.h>

#include <QueueList.h>

#include <Wire.h>
#include <LSM303.h>


LSM303 compass;

#define GRAVITY 256         // this equivalent to 1G in the raw data coming from the accelerometer 

// X axis pointing forward
// Y axis pointing to the right 
// and Z axis pointing down.
int SENSOR_SIGN[3] = {-1, -1, -1};  // correct directions x, y, z - accelerometer
int AN[3]; //array that stores accelerometer data
int AN_OFFSET[3] = {0,0,0}; //Array that stores the Offset of the sensors

int accel_x;
int accel_y;
int accel_z;

long timer=0;   //general purpuse timer
long timer_old;

void Accel_Init()
{
  compass.init();
  compass.enableDefault();
  switch (compass.getDeviceType())
  {
    case LSM303::device_D:
      compass.writeReg(LSM303::CTRL2, 0x18); // 8 g full scale: AFS = 011
      break;
    case LSM303::device_DLHC:
      compass.writeReg(LSM303::CTRL_REG4_A, 0x28); // 8 g full scale: FS = 10; high resolution output mode
      break;
    default: // DLM, DLH
      compass.writeReg(LSM303::CTRL_REG4_A, 0x30); // 8 g full scale: FS = 11
  }
}

// Reads x,y and z accelerometer registers
void Read_Accel()
{
  compass.readAcc();
  
  AN[0] = compass.a.x >> 4; // shift left 4 bits to use 12-bit representation (1 g = 256)
  AN[1] = compass.a.y >> 4;
  AN[2] = compass.a.z >> 4;
  accel_x = SENSOR_SIGN[0] * (AN[0] - AN_OFFSET[0]);
  accel_y = SENSOR_SIGN[1] * (AN[1] - AN_OFFSET[1]);
  accel_z = SENSOR_SIGN[2] * (AN[2] - AN_OFFSET[2]);
}

void I2C_Init()
{
  Wire.begin();
}

void setup() {
  Serial.begin(9600);
  
  I2C_Init();
  delay(1500);
  
  Accel_Init();
  delay(20);

  for (int i = 0; i < 32; i++)    // We take some readings...
  {
    Read_Accel();
    for (int y = 0; y < 3; y++)   // Cumulate values
      AN_OFFSET[y] += AN[y];
    delay(20);
  }

  for (int y = 0; y < 3; y++)
    AN_OFFSET[y] = AN_OFFSET[y]/32;

  AN_OFFSET[2] -= GRAVITY*SENSOR_SIGN[2];

  //Serial.println("Offset:");
  //for(int y=0; y<3; y++)
  //  Serial.println(AN_OFFSET[y]);

  delay(2000);
  timer = millis();
  delay(20);

  // Initialize the client
  Mirf.spi = &MirfHardwareSpi;
  Mirf.init();
  
  // Configure reciving address.
  Mirf.setRADDR((byte *)"clie1");
  Mirf.payload = 9;
  Mirf.config();
  Serial.println("Beginning ... "); 
}

void loop() {
  if ((millis()-timer) >= 1){  // Main loop runs at 1000Hz
    timer_old = timer;
    timer = millis();

    Read_Accel();

    byte data[Mirf.payload];
    byte temp;
    
    if (accel_x <= 0) {
      accel_x = -accel_x;
      data[0] = '-';
    } else {
      data[0] = '+';
    }
    data[1] = (byte)((accel_x & 0xFF00) >> 8);
    data[2] = (byte)(accel_x & 0xFF);

    if (accel_y <= 0) {
      accel_y = -accel_y;
      data[3] = '-';
    } else {
      data[3] = '+';
    }
    data[4] = (byte)((accel_y & 0xFF00) >> 8);
    data[5] = (byte)(accel_y & 0xFF);

    if (accel_z <= 0) {
      accel_z = -accel_z;
      data[6] = '-';
    } else {
      data[6] = '+';
    }
    data[7] = (byte)((accel_z & 0xFF00) >> 8);
    data[8] = (byte)(accel_z & 0xFF);

    // sending data
    Mirf.setTADDR((byte *)"serv1");
    Mirf.send(data);
    while(Mirf.isSending()){}
    Serial.println("Finished sending");
    
    Serial.println("Acc: ");
    Serial.print(data[0]);
    Serial.print(", ");
    Serial.print(data[1]);
    Serial.print(", ");
    Serial.println(data[2]);
  
    Serial.print(data[3]);
    Serial.print(", ");
    Serial.print(data[4]);
    Serial.print(", ");
    Serial.println(data[5]);
  
    Serial.print(data[6]);
    Serial.print(", ");
    Serial.print(data[7]);
    Serial.print(", ");
    Serial.println(data[8]);
    Serial.println("");
  }
}




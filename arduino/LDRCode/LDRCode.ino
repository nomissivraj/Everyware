void setup() {
  
  //initiating serial port, baud rate 9600
  Serial.begin(9600);
  
}


void loop() {

  //setting a variable for the sensor value for the LDR/Photoresistor
  int sensorValue = analogRead(A0);

  //printing the sensor value every 100ms
  Serial.println(sensorValue);
  delay(100);
  
}

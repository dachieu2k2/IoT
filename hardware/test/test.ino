// link references: https://innovationyourself.com/control-leds-display-dht11-on-mqtt/

#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#define DHTPIN D5     // Digital pin connected to the DHT sensor 

// Uncomment the type of sensor in use:
#define DHTTYPE DHT11     // DHT 11

DHT_Unified dht(DHTPIN, DHTTYPE);

uint32_t delayMS;

// Update these with values suitable for your network.

const char* ssid = "TP-Link_212C";    
const char* password = "hieulinh";    
const char* mqtt_server = "192.168.0.106";
const char* topic = "a"; //publish topic
const char* user = "hieu";
const char* passwd = "a";

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
String msgStr = "";
float temp, hum;


void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    
    Serial.print(".");
    digitalWrite(2,0);
    delay(200);
    digitalWrite(2,1);
    delay(200);
    
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Switch on the LED if an 1 was received as first character

  if ((char)payload[0] == '0') {
    digitalWrite(D6, LOW);   // Turn the LED on (Note that LOW is the voltage level
    // but actually the LED is on; this is because
    // it is active low on the ESP-01)
  } else if ((char)payload[0] == '1') {
    digitalWrite(D6, HIGH);  // Turn the LED off by making the voltage HIGH
  }
  else if ((char)payload[0] == '2') {
    digitalWrite(D7, HIGH);  // Turn the LED off by making the voltage HIGH
  }
  else if ((char)payload[0] == '3') {
    digitalWrite(D7, LOW);  // Turn the LED off by making the voltage HIGH
  }
  
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str(), user, passwd)) {
      Serial.println("connected");
      // Once connected, publish an announcement...
//      client.publish("device/temp", "Temperature value");
//      client.publish("device/humidity", "humidity value");
      
      // ... and resubscribe
      client.subscribe("device/led");
//      client.subscribe("device/led1");
//      client.subscribe("device/led2");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
//  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  pinMode(D6, OUTPUT);
  pinMode(D7, OUTPUT);
  
  dht.begin();
  sensor_t sensor;
  dht.temperature().getSensor(&sensor);

  dht.humidity().getSensor(&sensor);
  delayMS = sensor.min_delay / 1000;

  
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1889);
  client.setCallback(callback);
}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;

    
//    delay(delayMS);
  // Get temperature event and print its value.
  sensors_event_t event;
  dht.temperature().getEvent(&event);
  if (isnan(event.temperature)) {
    Serial.println(F("Error reading temperature!"));
  }
  else {
    Serial.print(F("Temperature: "));
    Serial.print(event.temperature);
    Serial.println(F("°C"));
    temp = event.temperature;
  }
  // Get humidity event and print its value.
  dht.humidity().getEvent(&event);
  if (isnan(event.relative_humidity)) {
    Serial.println(F("Error reading humidity!"));
  }
  else {
    Serial.print(F("Humidity: "));
    Serial.print(event.relative_humidity);
    Serial.println(F("%"));
    hum = event.relative_humidity;
  }
  int qt = analogRead(A0);
  Serial.println(qt);
    
    
    msgStr = String(qt) + ","+ String(temp) +","+String(hum);
    byte arrSize = msgStr.length() + 1;
    char msg[arrSize];
    Serial.print("PUBLISH DATA:");
    Serial.println(msgStr);
    msgStr.toCharArray(msg, arrSize);
    client.publish(topic, msg);
    msgStr = "";
    delay(50);
  }
}
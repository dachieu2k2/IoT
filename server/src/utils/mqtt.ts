import mqtt from 'mqtt'

const protocol = 'mqtt'
const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const username = 'hieu'
const password = '123'

const connectUrl = `${protocol}://${host}:${port}`

export const MQTTClient = mqtt.connect('mqtt://192.168.0.106', {
  port: 1883,
  clientId,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
  username,
  password
})

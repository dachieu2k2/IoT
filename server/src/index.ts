import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'

import { actionHistoryRouter, apiDocsRouter, dataSensorRouter } from './routes'
import { addTimestamp, errorHandler, logger } from './middlewares'
import { MQTTClient } from './utils/mqtt'
import { saveActionHistory } from './controllers/actionHistory.controller'
import { saveDataSensor } from './controllers/dataSensor.controller'

const app = express()

app.use(express.json())
app.use(cors())
app.use(addTimestamp)
app.use(logger)
// app.use(openApiValidator)

app.get('/', (req, res) => {
  return res.send('hello world')
})

app.use('/dev/document', apiDocsRouter)
app.use('/api/datasensors', dataSensorRouter)
app.use('/api/actionhistory', actionHistoryRouter)

app.use(errorHandler)

const PORT = process.env.PORT || 4000

const server = app.listen(PORT, () => console.log(`App listen on PORT: ${PORT}`))

// Socket
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
})

let timeChange: ReturnType<typeof setInterval>
let count = 0

MQTTClient.on('connect', () => {
  MQTTClient.subscribe([
    'dataSensor',
    'device/led/message',
    'device/fan/message',
    'device/led2/message',
    'device/led',
    'device/led2',
    'device/fan'
  ])
})

let test = 0

MQTTClient.on('message', (topic, payload) => {
  // message is Buffer
  console.log('Received Message:', topic, payload.toString())

  if (topic === 'dataSensor') {
    count += 1
    const dataFromMqtt = JSON.parse(payload.toString())
    const newData = {
      valueTemperature: dataFromMqtt.temperature,
      valueHumidity: dataFromMqtt.humidity,
      valueLight: dataFromMqtt.light,
      valueDust: dataFromMqtt.dust,
      label: count
    }
    if (newData.valueHumidity)
      saveDataSensor({
        humidity: newData.valueHumidity.toString(),
        temperature: newData.valueTemperature.toString(),
        light: newData.valueLight.toString(),
        dust: newData.valueDust.toString()
      })

    io.emit('dataUpdate', newData)
    // console.log(newData)
    // io.emit('dataUpdate', newData)
  }

  if (topic === 'device/led/message') {
    const dataFromMqtt = JSON.parse(payload.toString())
    console.log(dataFromMqtt, 'Chạy trước')
    if (dataFromMqtt) {
      saveActionHistory({ act: dataFromMqtt.status === 'true' ? 'On' : 'Off', device: 'Light' })
      io.emit('device/led/message', dataFromMqtt)
    }
    test++
    console.log(test, 'Chạy sau')
  }
  if (topic === 'device/fan/message') {
    const dataFromMqtt = JSON.parse(payload.toString())
    console.log(dataFromMqtt)
    if (dataFromMqtt) {
      saveActionHistory({ act: dataFromMqtt.status === 'true' ? 'On' : 'Off', device: 'Fan' })
      io.emit('device/fan/message', dataFromMqtt)
    }
  }
  if (topic === 'device/led2/message') {
    const dataFromMqtt = JSON.parse(payload.toString())
    console.log(dataFromMqtt)
    if (dataFromMqtt) {
      saveActionHistory({ act: dataFromMqtt.status === 'true' ? 'On' : 'Off', device: 'Light2' })
      io.emit('device/led2/message', dataFromMqtt)
    }
  }
})

io.on('connection', (socket) => {
  // if (timeChange) clearInterval(timeChange)
  console.log('connected to socket.io', socket.id)
  // timeChange = setInterval(() => {
  // count += 1
  // const newData = {
  //   label: count,
  //   valueTemperature: Math.floor(Math.random() * 100),
  //   valueHumidity: Math.floor(Math.random() * 100),
  //   valueLight: Math.floor(Math.random() * 100)
  // }
  // saveDataSensor({
  //   humidity: newData.valueHumidity.toString(),
  //   temperature: newData.valueTemperature.toString(),
  //   light: newData.valueLight.toString()
  // })

  // saveActionHistory({
  //     device: Math.floor(Math.random() * 100) > 50 ? 'Light' : 'Fan',
  //     act: Math.floor(Math.random() * 100) > 50 ? 'Off' : 'On',
  // })
  // io.emit('dataUpdate', newData)
  // }, 1000)

  socket.on('toggleLight', (payload) => {
    console.log('run socket')

    // MQTT client

    MQTTClient.subscribe('device/led', (err) => {
      console.log('run sub?')
      if (!err) {
        if (payload === true) {
          MQTTClient.publish('device/led', '1')
        } else {
          MQTTClient.publish('device/led', '0')
        }
      }
    })
  })
  socket.on('toggleFan', (payload) => {
    console.log('run socket', payload)

    MQTTClient.subscribe('device/fan', (err) => {
      console.log('run sub?')
      if (!err) {
        if (payload === true) {
          MQTTClient.publish('device/fan', '1')
        } else {
          MQTTClient.publish('device/fan', '0')
        }
      }
    })
  })
  socket.on('toggleLight2', (payload) => {
    console.log('run socket')

    // MQTT client

    MQTTClient.subscribe('device/led2', (err) => {
      console.log('run sub?')
      if (!err) {
        if (payload === true) {
          MQTTClient.publish('device/led2', '1')
        } else {
          MQTTClient.publish('device/led2', '0')
        }
      }
    })
  })

  socket.on('disconnect', () => {
    console.log('socket disconnect')
  })
})

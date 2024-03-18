import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'

import { actionHistoryRouter, apiDocsRouter, dataSensorRouter } from './routes'
import { addTimestamp, errorHandler, logger } from './middlewares'
import { MQTTClient } from './utils/mqtt'

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

io.on('connection', (socket) => {
  if (timeChange) clearInterval(timeChange)
  console.log('connected to socket.io', socket.id)
  timeChange = setInterval(() => {
    count += 1
    const newData = {
      label: count,
      valueTemperature: Math.floor(Math.random() * 100),
      valueHumidity: Math.floor(Math.random() * 100),
      valueLight: Math.floor(Math.random() * 100)
    }
    // saveDataSensor({
    //   humidity: newData.valueHumidity.toString(),
    //   temperature: newData.valueTemperature.toString(),
    //   light: newData.valueLight.toString()
    // })

    // saveActionHistory({
    //     device: Math.floor(Math.random() * 100) > 50 ? 'Light' : 'Fan',
    //     act: Math.floor(Math.random() * 100) > 50 ? 'Off' : 'On',
    // })
    io.emit('dataUpdate', newData)
  }, 1000)

  socket.on('toggleLight', (payload) => {
    // MQTT client

    MQTTClient.on('connect', () => {
      console.log('run connect?')

      MQTTClient.subscribe('a', (err) => {
        console.log('run sub?')

        if (!err) {
          // Turn light D6
          if (payload === true) {
            MQTTClient.publish('device/led', '1')
          } else {
            MQTTClient.publish('device/led', '0')
          }

          // MQTTClient.publish("a", "hello mqtt")
        }
        MQTTClient.end()
      })
    })
  })
  socket.on('toggleFan', (payload) => {
    MQTTClient.on('connect', () => {
      console.log('run connect?')

      MQTTClient.subscribe('a', (err) => {
        console.log('run sub?')

        if (!err) {
          // Turn light D7
          if (payload === true) {
            MQTTClient.publish('device/led', '2')
          } else {
            MQTTClient.publish('device/led', '3')
          }

          // MQTTClient.publish("a", "hello mqtt")
        }
        MQTTClient.end()
      })
    })
  })
  // MQTTClient.on("message", (topic, payload) => {
  //     // message is Buffer
  //     console.log('Received Message:', topic, payload.toString())
  //     // MQTTClient.end();
  // });

  socket.on('disconnect', () => {
    console.log('socket disconnect')
  })
})

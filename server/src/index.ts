import express from "express";
import cors from 'cors';
import { Server } from "socket.io";


import { saveDataSensor } from "./controllers/dataSensor.controller";






const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    return res.send('hello world')
})



const PORT = process.env.PORT || 4000

const server = app.listen(PORT, () => console.log(`App listen on PORT: ${PORT}`))


// Socket
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

let timeChange: ReturnType<typeof setInterval>;
let count = 0;


io.on("connection", (socket) => {
    if (timeChange) clearInterval(timeChange);
    console.log("connected to socket.io", socket.id);
    timeChange = setInterval(() => {
        count += 1;
        const newData = {
            label: count,
            valueTemperature: Math.floor(Math.random() * 100),
            valueHumidity: Math.floor(Math.random() * 100),
            valueLight: Math.floor(Math.random() * 100),
        };
        saveDataSensor({
            humidity: newData.valueHumidity.toString(),
            temperature: newData.valueTemperature.toString(),
            light: newData.valueLight.toString(),
        })
        io.emit("dataUpdate", newData);
    }, 1000)


    socket.on("disconnect", () => {
        console.log("socket disconnect");
    });
});


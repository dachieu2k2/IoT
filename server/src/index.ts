import express from "express";
import cors from 'cors';
import { Server } from "socket.io";


import { getDataSensors, saveDataSensor } from "./controllers/dataSensor.controller";
import { getActionHistorys, saveActionHistory } from "./controllers/actionHistory.controller";






const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    return res.send('hello world')
})

app.get('/api/datasensors', async (req, res) => {
    try {
        const { page = 1, limit = 10, orderBy = 'id', order = 'ASC', s = '' } = req.query

        console.log(page, limit, orderBy, order, s);


        const data = await getDataSensors({ page: +page, limit: +limit, orderBy: orderBy.toString(), sortBy: order.toString(), s: s?.toString() })
        // console.log('data index: ', data);


        return res.json({ success: true, data: data })
    } catch (error) {
        console.log(error);

    }
})

app.get('/api/actionhistory', async (req, res) => {
    try {
        const { page = 1, limit = 10, orderBy = 'id', order = 'ASC', s = '' } = req.query

        console.log(page, limit, orderBy, order, s);


        const data = await getActionHistorys({ page: +page, limit: +limit, orderBy: orderBy.toString(), sortBy: order.toString(), s: s?.toString() })
        // console.log('data index: ', data);


        return res.json({ success: true, data: data })
    } catch (error) {
        console.log(error);

    }
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
        // saveDataSensor({
        //     humidity: newData.valueHumidity.toString(),
        //     temperature: newData.valueTemperature.toString(),
        //     light: newData.valueLight.toString(),
        // })

        // saveActionHistory({
        //     device: Math.floor(Math.random() * 100) > 50 ? 'Light' : 'Fan',
        //     act: Math.floor(Math.random() * 100) > 50 ? 'Off' : 'On',
        // })
        io.emit("dataUpdate", newData);
    }, 1000)


    socket.on("disconnect", () => {
        console.log("socket disconnect");
    });
});


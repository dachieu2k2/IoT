import express from "express";
import { Server } from "socket.io";

const app = express()

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
            value: Math.floor(Math.random() * 100),
        };
        io.emit("dataUpdate", newData);
    }, 1000)

    // setInterval(() => {


    //     // Emit data to all connected clients
    //     io.emit('dataUpdate', newData);
    // }, 1000);


    socket.on("disconnect", () => {
        console.log("socket disconnect");
        // characters = characters.filter(
        //     (value) => value.id !== socket.id)
    });
});


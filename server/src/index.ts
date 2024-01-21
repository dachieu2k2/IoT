import express from "express";

const app = express()

app.get('/', (req, res) => {
    return res.send('hello world')
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`App listen on PORT: ${PORT}`))
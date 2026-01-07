const connect = require ("./connect")
const express = require ("express")
const cors = require ("cors")
require("dotenv").config()
const posts = require('./postRoutes')
const users = require('./userRoutes')

const app = express();
const port = process.env.PORT


app.use(cors())
app.use(express.json())
app.use(posts)
app.use(users)

app.listen(port, () => {
    connect.connectToServer()
    console.log(`server is running on port ${port}`)
})
const connect = require ("./connect")
const express = require ("express")
const cors = require ("cors")
require("dotenv").config({path:"./config.env"})
const posts = require('./postRoutes')
const users = require('./userRoutes')

const app = express();
const port = process.env.PORT


app.use (cors()) // sharing of resources, connects frontend and backend
app.use (express.json()) // parse requests in json format, avoids json.parse
app.use(posts)
app.use(users)

app.listen(port, () => {
    connect.connectToServer()
    console.log(`server is running on port ${port}`)
})
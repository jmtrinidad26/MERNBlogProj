const connect = require ("./connect")
const express = require ("express")
const cors = require ("cors")
require("dotenv").config()
const posts = require('./postRoutes')
const users = require('./userRoutes')

const app = express();
const port = process.env.PORT

const corsOptions = {
    origin: [
      'http://localhost:5173', // Local Vite dev
      'http://localhost:3000', // Alternative local
      'https://your-frontend-name.vercel.app' 
    ],
    credentials: true,
    optionsSuccessStatus: 200
  };
  
app.use(cors(corsOptions));
app.use(express.json())
app.use(posts)
app.use(users)

app.listen(port, () => {
    connect.connectToServer()
    console.log(`server is running on port ${port}`)
})
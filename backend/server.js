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
      'http://localhost:5173',
      'https://blog-21xftzh97-jmtrinidads-projects-c5d38af8.vercel.app' 
    ],
    credentials: true,
    optionsSuccessStatus: 200
  };
  
  app.use(cors(corsOptions));
app.use(express.json())
app.use(posts)
app.use(users)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
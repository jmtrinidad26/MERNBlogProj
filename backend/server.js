const connect = require("./connect");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const posts = require('./postRoutes');
const users = require('./userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://blog-app-pi-blue.vercel.app',
    'https://blog-21xftzh97-jmtrinidads-projects-c5d38af8.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(posts);
app.use(users);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'MERN Blog API is running' });
});

// IMPORTANT: Connect to database FIRST, then start server
const startServer = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connect.connectToServer();
    console.log('✅ MongoDB connected successfully!');
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();
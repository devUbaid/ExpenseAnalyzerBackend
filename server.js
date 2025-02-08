const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');  // ✅ Import cookie-parser
const { db } = require('./db/db');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const corsConfig = {
    origin: ["http://localhost:3000", "https://your-vercel-app.vercel.app"], 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true,
};

app.use(cors(corsConfig));

// Middlewares
app.use(express.json());
app.use(cors(corsConfig)); 
app.use(cookieParser());  // ✅ Use cookie-parser

// Explicitly Define Routes
app.use('/api/v1/auth', require('./routes/auths')); // Login Route
app.use('/api/v1/users', require('./routes/users')); // Registration Route
app.use('/api/v1/transactions', require('./routes/transactions')); // Add this line




// Start Server
const startServer = async () => {
    try {
        await db(); // Ensure database connects before starting the server
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    } catch (error) {
        console.error('Error starting server:', error.message);
        process.exit(1);
    }
};

startServer();

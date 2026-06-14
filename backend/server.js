require('dotenv').config(); // MUST be the first line

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// app.use(cors());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ── Import Routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// ── Environment Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ── Database Connection 
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.log("❌ Database Connection Error:", err));

// ── Base Route 
app.get('/', (req, res) => {
    res.send('AutoCare Backend is running...');
});

// ── Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes); 
app.use('/api/bookings', bookingRoutes);
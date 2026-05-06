//backend/models/Service.js

const mongoose = require('mongoose');

// Service Schema - Admin manages these (oil change, tire rotation, etc.)
const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Service name is required'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Description is required']
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative']
        },
        duration: {
            type: String, // e.g., "30 mins", "1 hour"
            required: [true, 'Duration is required']
        },
        isAvailable: {
            type: Boolean,
            default: true // Admin can disable a service without deleting it
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Service', serviceSchema);
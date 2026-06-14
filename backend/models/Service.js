
const mongoose = require('mongoose');

// Service Schema
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
            type: String, 
            required: [true, 'Duration is required']
        },
        isAvailable: {
            type: Boolean,
            default: true 
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Service', serviceSchema);
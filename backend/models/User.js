//backend/models/User.js

const mongoose = require('mongoose');

// User Schema - stores both Admin and Customer accounts
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,       // No duplicate emails
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6
        },
        role: {
            type: String,
            enum: ['customer', 'admin', 'manager'], // Only these two values allowed
            default: 'customer'          // Everyone is a customer by default
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt automatically
    }
);

module.exports = mongoose.model('User', userSchema);
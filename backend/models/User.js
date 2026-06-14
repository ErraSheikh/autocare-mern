//backend/models/User.js

const mongoose = require('mongoose');

// User Schema 
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
            unique: true,      
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
            enum: ['customer', 'admin', 'manager'], 
            default: 'customer'         
        }
    },
    {
        timestamps: true 
    }
);

module.exports = mongoose.model('User', userSchema);
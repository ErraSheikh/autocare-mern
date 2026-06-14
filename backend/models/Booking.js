

const mongoose = require('mongoose');

// Booking Schema 
const bookingSchema = new mongoose.Schema(
    {
       
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',            // Links to User model
            required: true
        },
        // Which service was booked
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',         // Links to Service model
            required: true
        },
        // Preferred appointment date and time
        appointmentDate: {
            type: Date,
            required: [true, 'Appointment date is required']
        },
        // Vehicle information
        vehicleDetails: {
            make: { type: String, required: true },   
            model: { type: String, required: true },  
            year: { type: Number, required: true }    
        },
        // Booking status - Admin can update this
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending'
        },
        paymentStatus: {
            type: String,
            enum: ['unpaid', 'paid'],
            default: 'unpaid'
        },
        totalAmount: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Booking', bookingSchema);
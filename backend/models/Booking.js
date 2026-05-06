//backend/models/Booking.js

const mongoose = require('mongoose');

// Booking Schema - Customer books a service
const bookingSchema = new mongoose.Schema(
    {
        // Which customer made this booking
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
            make: { type: String, required: true },   // e.g., Toyota
            model: { type: String, required: true },  // e.g., Corolla
            year: { type: Number, required: true }    // e.g., 2020
        },
        // Booking status - Admin can update this
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending'
        },
        // Mock payment - no real gateway, just simulation
        paymentStatus: {
            type: String,
            enum: ['unpaid', 'paid'],
            default: 'unpaid'
        },
        // Snapshot of price at time of booking (price might change later)
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
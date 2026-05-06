const Booking = require('../models/Booking');
const Service = require('../models/Service');

// ─────────────────────────────────────────
// @route   POST /api/bookings
// @desc    Customer creates a new booking
// @access  Private (logged in customers)
// ─────────────────────────────────────────
const createBooking = async (req, res) => {
    try {
        const { serviceId, appointmentDate, vehicleDetails } = req.body;

        // 1. Check all fields are provided
        if (!serviceId || !appointmentDate || !vehicleDetails) {
            return res.status(400).json({ message: 'Please provide all booking details' });
        }

        // 2. Check vehicle details are complete
        const { make, model, year } = vehicleDetails;
        if (!make || !model || !year) {
            return res.status(400).json({ message: 'Please provide vehicle make, model and year' });
        }

        // 3. Check the service exists and is available
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        if (!service.isAvailable) {
            return res.status(400).json({ message: 'This service is currently unavailable' });
        }

        // 4. Create the booking
        // req.user._id comes from our protect middleware (JWT token)
        const booking = await Booking.create({
            customer: req.user._id,
            service: serviceId,
            appointmentDate,
            vehicleDetails: { make, model, year },
            totalAmount: service.price  // Snapshot price at time of booking
        });

        // 5. Populate service and customer details in response
        const populatedBooking = await Booking.findById(booking._id)
            .populate('service', 'name price duration')    // Get service name/price
            .populate('customer', 'name email');           // Get customer name/email

        res.status(201).json({
            message: 'Booking created successfully',
            booking: populatedBooking
        });

    } catch (error) {
        console.error('Create Booking Error:', error);
        res.status(500).json({ message: 'Server error while creating booking' });
    }
};

// ─────────────────────────────────────────
// @route   GET /api/bookings/my-bookings
// @desc    Customer views their own bookings (service history)
// @access  Private (logged in customer)
// ─────────────────────────────────────────
const getMyBookings = async (req, res) => {
    try {
        // Only return bookings that belong to the logged-in customer
        const bookings = await Booking.find({ customer: req.user._id })
            .populate('service', 'name price duration')
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json({
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error('Get My Bookings Error:', error);
        res.status(500).json({ message: 'Server error while fetching bookings' });
    }
};

// ─────────────────────────────────────────
// @route   GET /api/bookings
// @desc    Admin views ALL bookings
// @access  Private/Admin
// ─────────────────────────────────────────
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('service', 'name price duration')
            .populate('customer', 'name email')
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json({
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error('Get All Bookings Error:', error);
        res.status(500).json({ message: 'Server error while fetching all bookings' });
    }
};

// ─────────────────────────────────────────
// @route   PUT /api/bookings/:id/status
// @desc    Admin updates booking status
// @access  Private/Admin
// ─────────────────────────────────────────
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate the status value
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
            });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({
            message: `Booking status updated to "${status}"`,
            booking
        });

    } catch (error) {
        console.error('Update Booking Status Error:', error);
        res.status(500).json({ message: 'Server error while updating booking status' });
    }
};

// ─────────────────────────────────────────
// @route   PUT /api/bookings/:id/pay
// @desc    Mock payment - customer pays for booking
// @access  Private (logged in customer)
// ─────────────────────────────────────────
const mockPayment = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Make sure the booking belongs to the logged-in customer
        if (booking.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to pay for this booking' });
        }

        // Check if already paid
        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({ message: 'This booking is already paid' });
        }

        // Simulate payment — just flip the status to paid
        booking.paymentStatus = 'paid';
        await booking.save();

        res.status(200).json({
            message: '✅ Payment successful! (Mock)',
            amountPaid: booking.totalAmount,
            booking
        });

    } catch (error) {
        console.error('Mock Payment Error:', error);
        res.status(500).json({ message: 'Server error during payment' });
    }
};

// ─────────────────────────────────────────
// @route   DELETE /api/bookings/:id
// @desc    Customer cancels their own booking
// @access  Private (logged in customer)
// ─────────────────────────────────────────
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Only the customer who made the booking can cancel it
        if (booking.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        // Cannot cancel a completed booking
        if (booking.status === 'completed') {
            return res.status(400).json({ message: 'Cannot cancel a completed booking' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({ message: 'Booking cancelled successfully', booking });

    } catch (error) {
        console.error('Cancel Booking Error:', error);
        res.status(500).json({ message: 'Server error while cancelling booking' });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus,
    mockPayment,
    cancelBooking
};
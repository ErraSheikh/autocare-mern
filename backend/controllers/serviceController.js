const Service = require('../models/Service');


// @route   POST /api/services
// @desc    Create a new service (Admin only)
// @access  Private/Admin

const createService = async (req, res) => {
    try {
        const { name, description, price, duration } = req.body;

        // Check all fields are provided
        if (!name || !description || !price || !duration) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const service = await Service.create({
            name,
            description,
            price,
            duration
        });

        res.status(201).json({
            message: 'Service created successfully',
            service
        });

    } catch (error) {
        console.error('Create Service Error:', error);
        res.status(500).json({ message: 'Server error while creating service' });
    }
};

// @route   GET /api/services
// @desc    Get all available services
// @access  Public (anyone can view services)
const getAllServices = async (req, res) => {
    try {
        // Only return services that are available
        const services = await Service.find({ isAvailable: true });

        res.status(200).json({
            count: services.length,
            services
        });

    } catch (error) {
        console.error('Get Services Error:', error);
        res.status(500).json({ message: 'Server error while fetching services' });
    }
};

// @route   GET /api/services/:id
// @desc    Get a single service by ID
// @access  Public
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.status(200).json({ service });

    } catch (error) {
        console.error('Get Service Error:', error);
        res.status(500).json({ message: 'Server error while fetching service' });
    }
};

// @route   PUT /api/services/:id
// @desc    Update a service (Admin only)
// @access  Private/Admin
const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            { ...req.body },        
            { new: true }           
        );

        res.status(200).json({
            message: 'Service updated successfully',
            service: updatedService
        });

    } catch (error) {
        console.error('Update Service Error:', error);
        res.status(500).json({ message: 'Server error while updating service' });
    }
};

// @route   DELETE /api/services/:id
// @desc    Delete a service (Admin only)
// @access  Private/Admin
const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        await Service.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Service deleted successfully' });

    } catch (error) {
        console.error('Delete Service Error:', error);
        res.status(500).json({ message: 'Server error while deleting service' });
    }
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};
const express = require('express');
const router = express.Router();
const {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
} = require('../controllers/serviceController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// ── Public Routes (no login needed) ───────
router.get('/', getAllServices);           // View all services
router.get('/:id', getServiceById);       // View single service

// ── Admin Only Routes ──────────────────────
// protect = must be logged in
// adminOnly = must be an admin
router.post('/', protect, adminOnly, createService);        // Add service
router.put('/:id', protect, adminOnly, updateService);      // Edit service
router.delete('/:id', protect, adminOnly, deleteService);   // Delete service

module.exports = router;
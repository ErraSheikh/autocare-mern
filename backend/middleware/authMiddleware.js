const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─────────────────────────────────────────
// Middleware: Protect Routes (must be logged in)
// ─────────────────────────────────────────
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {

            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } else {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// ─────────────────────────────────────────
// Middleware: Admin Only
// ─────────────────────────────────────────
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admins only' });
    }
};

// ─────────────────────────────────────────
// Middleware: Manager Only
// ─────────────────────────────────────────
const managerOnly = (req, res, next) => {
    if (req.user && req.user.role === 'manager') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Managers only' });
    }
};

// ─────────────────────────────────────────
// Middleware: Admin OR Manager
// Used for routes both roles can access
// ─────────────────────────────────────────
const adminOrManager = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admins or Managers only' });
    }
};

module.exports = { protect, adminOnly, managerOnly, adminOrManager };
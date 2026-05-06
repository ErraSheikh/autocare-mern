const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper: Generate JWT Token
const generateToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role: role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// ─────────────────────────────────────────
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Public registration always creates a customer
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'customer'
        });

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// ─────────────────────────────────────────
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// ─────────────────────────────────────────
// @route   GET /api/auth/users
// @desc    Admin views all user accounts
// @access  Private/Admin
// ─────────────────────────────────────────
const getAllUsers = async (req, res) => {
    try {
        // Fetch all users but never return their passwords
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        res.status(200).json({
            count: users.length,
            users
        });

    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
};

// ─────────────────────────────────────────
// @route   PUT /api/auth/users/:id/role
// @desc    Admin updates a user's role
// @access  Private/Admin
// ─────────────────────────────────────────
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        // Validate the role value
        const validRoles = ['customer', 'manager', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from changing their own role
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot change your own role' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            message: `User role updated to "${role}"`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Update Role Error:', error);
        res.status(500).json({ message: 'Server error while updating role' });
    }
};

module.exports = { registerUser, loginUser, getAllUsers, updateUserRole };
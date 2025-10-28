import express from 'express';
import { loginUser, registerUser, getUserProfile, logoutUser } from '../controllers/userControllers.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// User registration route
router.post('/register', registerUser);

// User login route
router.post('/login', loginUser);

// Get user profile route
router.get('/profile', authMiddleware, getUserProfile);

// User logout route
router.get('/logout', authMiddleware, logoutUser);

export default router;
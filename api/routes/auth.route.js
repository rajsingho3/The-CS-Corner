import express from 'express';
import { google, signin, signup, verifyOtp } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.post('/verify-otp', verifyOtp);

export default router;
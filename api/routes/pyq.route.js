import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  createPYQ,
  getPYQs,
  getPYQsByOrganization,
  updatePYQ,
  deletePYQ,
  approvePYQ,
  incrementDownload,
  getPYQStats
} from '../controllers/pyq.controller.js';

const router = express.Router();

// Create a new PYQ paper (requires authentication)
router.post('/create', verifyToken, createPYQ);

// Get PYQ papers with filtering and pagination
router.get('/getpyqs', getPYQs);

// Get PYQs organized by semester and year
router.get('/organized', getPYQsByOrganization);

// Get PYQ statistics
router.get('/stats', getPYQStats);

// Update PYQ paper (requires authentication and ownership/admin)
router.put('/update/:pyqId', verifyToken, updatePYQ);

// Delete PYQ paper (requires authentication and ownership/admin)
router.delete('/delete/:pyqId', verifyToken, deletePYQ);

// Approve PYQ paper (admin only)
router.put('/approve/:pyqId', verifyToken, approvePYQ);

// Increment download count
router.put('/download/:pyqId', incrementDownload);

export default router;

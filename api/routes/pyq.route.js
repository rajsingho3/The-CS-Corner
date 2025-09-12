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

router.post('/create', verifyToken, createPYQ);

router.get('/getpyqs', getPYQs);

router.get('/organized', getPYQsByOrganization);


router.get('/stats', getPYQStats);

router.put('/update/:pyqId', verifyToken, updatePYQ);


router.delete('/delete/:pyqId', verifyToken, deletePYQ);


router.put('/approve/:pyqId', verifyToken, approvePYQ);

router.put('/download/:pyqId', incrementDownload);

export default router;

import express from "express";
import { test, signout, updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);

// Temporary endpoint to make a user admin (for testing only)
router.put('/make-admin/:userId', verifyToken, async (req, res) => {
  try {
    const { User } = await import('../models/user.model.js');
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { isAdmin: true },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'User is now an admin',
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to make user admin' });
  }
});

export default router;
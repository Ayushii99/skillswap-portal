const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getMyProfile,
  updateProfile,
  getAllUsers,
  getSkillMatches,
} = require('../controllers/userController');

const router = express.Router();

router.get('/me', protect, getMyProfile);
router.put('/profile', protect, updateProfile);
router.get('/matches', protect, getSkillMatches);
router.get('/', protect, getAllUsers);

module.exports = router;
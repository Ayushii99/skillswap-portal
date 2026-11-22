const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createSwapRequest,
  getMySwaps,
  respondToSwap,
  completeSwap,
  updateMeetingLink,
} = require('../controllers/swapController');

const router = express.Router();

router.post('/', protect, createSwapRequest);
router.get('/my', protect, getMySwaps);
router.patch('/:id/respond', protect, respondToSwap);
router.patch('/:id/complete', protect, completeSwap);
router.patch('/:id/meeting-link', protect, updateMeetingLink);

module.exports = router;
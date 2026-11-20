const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createSwapRequest,
  getMySwaps,
  respondToSwap,
  completeSwap,
} = require('../controllers/swapController');

const router = express.Router();

router.post('/', protect, createSwapRequest);
router.get('/my', protect, getMySwaps);
router.patch('/:id/respond', protect, respondToSwap);
router.patch('/:id/complete', protect, completeSwap);

module.exports = router;
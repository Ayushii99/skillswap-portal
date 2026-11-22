const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');

// @route POST /api/swaps
const createSwapRequest = async (req, res) => {
  try {
    const {
      providerId,
      skillToLearn,
      skillOfferedInReturn,
      creditsUsed = 1,
      message,
    } = req.body;

    if (!providerId || !skillToLearn) {
      return res
        .status(400)
        .json({ message: 'providerId and skillToLearn are required' });
    }

    if (providerId.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: 'You cannot send a swap request to yourself' });
    }

    const provider = await User.findById(providerId).select('-password');
    if (!provider) {
      return res.status(404).json({ message: 'Skill provider not found' });
    }

    const creditAmount = Number(creditsUsed) || 1;
    if (creditAmount < 1) {
      return res
        .status(400)
        .json({ message: 'creditsUsed must be at least 1' });
    }

    if (req.user.skillCredits < creditAmount) {
      return res.status(400).json({
        message: `Insufficient Skill Credits. You have ${req.user.skillCredits}, need ${creditAmount}.`,
      });
    }

    const swap = await SwapRequest.create({
      requester: req.user._id,
      provider: provider._id,
      skillToLearn: skillToLearn.trim(),
      skillOfferedInReturn: (skillOfferedInReturn || '').trim(),
      creditsUsed: creditAmount,
      message: (message || '').trim(),
    });

    const populatedSwap = await SwapRequest.findById(swap._id)
      .populate('requester', 'name email collegeName skillCredits')
      .populate('provider', 'name email collegeName skillsOffered');

    return res.status(201).json(populatedSwap);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route GET /api/swaps/my
const getMySwaps = async (req, res) => {
  try {
    const swaps = await SwapRequest.find({
      $or: [{ requester: req.user._id }, { provider: req.user._id }],
    })
      .populate('requester', 'name email collegeName location skillCredits')
      .populate('provider', 'name email collegeName location skillsOffered')
      .sort({ createdAt: -1 });

    // Hide contact email and meetingLink until swap is accepted or completed
    const sanitizedSwaps = swaps.map((swap) => {
      const obj = swap.toObject();
      if (!['accepted', 'completed'].includes(obj.status)) {
        if (obj.requester) delete obj.requester.email;
        if (obj.provider) delete obj.provider.email;
        obj.meetingLink = '';
      }
      return obj;
    });

    return res.json(sanitizedSwaps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route PATCH /api/swaps/:id/respond
const respondToSwap = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res
        .status(400)
        .json({ message: 'Status must be either accepted or rejected' });
    }

    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (swap.provider.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Only the skill provider can respond to this request' });
    }

    if (swap.status !== 'pending') {
      return res
        .status(400)
        .json({ message: `Swap is already ${swap.status}` });
    }

    swap.status = status;
    await swap.save();

    const updated = await SwapRequest.findById(swap._id)
      .populate('requester', 'name email collegeName skillCredits')
      .populate('provider', 'name email collegeName skillsOffered');

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route PATCH /api/swaps/:id/meeting-link
const updateMeetingLink = async (req, res) => {
  try {
    const { meetingLink } = req.body;
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    const userId = req.user._id.toString();
    const isParticipant =
      swap.requester.toString() === userId ||
      swap.provider.toString() === userId;

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized for this swap' });
    }

    if (swap.status !== 'accepted') {
      return res.status(400).json({
        message: 'Meeting link can only be added once the swap is accepted',
      });
    }

    swap.meetingLink = (meetingLink || '').trim();
    await swap.save();

    return res.json({
      message: 'Session link updated successfully',
      meetingLink: swap.meetingLink,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route PATCH /api/swaps/:id/complete
const completeSwap = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    const isParticipant =
      swap.requester.toString() === req.user._id.toString() ||
      swap.provider.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res
        .status(403)
        .json({ message: 'Not authorized to complete this swap' });
    }

    if (swap.status !== 'accepted') {
      return res.status(400).json({
        message: 'Only accepted swaps can be marked as completed',
      });
    }

    const requester = await User.findById(swap.requester);
    const provider = await User.findById(swap.provider);

    if (!requester || !provider) {
      return res.status(404).json({ message: 'Participant user not found' });
    }

    if (requester.skillCredits < swap.creditsUsed) {
      return res.status(400).json({
        message: 'Requester no longer has enough Skill Credits to complete swap',
      });
    }

    requester.skillCredits -= swap.creditsUsed;
    requester.completedSwaps += 1;

    provider.skillCredits += swap.creditsUsed;
    provider.completedSwaps += 1;

    swap.status = 'completed';

    await requester.save();
    await provider.save();
    await swap.save();

    const completedSwap = await SwapRequest.findById(swap._id)
      .populate('requester', 'name email collegeName skillCredits completedSwaps')
      .populate('provider', 'name email collegeName skillCredits completedSwaps');

    return res.json({
      message: 'Swap completed and Skill Credits transferred!',
      swap: completedSwap,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSwapRequest,
  getMySwaps,
  respondToSwap,
  updateMeetingLink,
  completeSwap,
};
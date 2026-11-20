const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skillToLearn: {
      type: String,
      required: [true, 'Skill to learn is required'],
      trim: true,
    },
    skillOfferedInReturn: {
      type: String,
      default: '',
      trim: true,
    },
    creditsUsed: {
      type: Number,
      default: 1,
      min: 1,
    },
    message: {
      type: String,
      default: '',
      maxlength: 400,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
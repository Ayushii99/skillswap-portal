const User = require('../models/User');

// @route GET /api/users/me
const getMyProfile = async (req, res) => {
  try {
    return res.json(req.user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, collegeName, location, bio, skillsOffered, skillsWanted } =
      req.body;

    if (name !== undefined) user.name = name;
    if (collegeName !== undefined) user.collegeName = collegeName;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (Array.isArray(skillsOffered)) {
      user.skillsOffered = skillsOffered.map((s) => s.trim()).filter(Boolean);
    }
    if (Array.isArray(skillsWanted)) {
      user.skillsWanted = skillsWanted.map((s) => s.trim()).filter(Boolean);
    }

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;

    return res.json(userObj);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route GET /api/users (browse peers with optional ?skill= and ?location=)
const getAllUsers = async (req, res) => {
  try {
    const { skill, location } = req.query;
    const query = { _id: { $ne: req.user._id } };

    if (skill && skill.trim()) {
      const regex = new RegExp(skill.trim(), 'i');
      query.skillsOffered = regex;
    }

    if (location && location.trim()) {
      query.location = new RegExp(location.trim(), 'i');
    }

    const users = await User.find(query).select('-password');
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route GET /api/users/matches (smart skill matchmaker)
const getSkillMatches = async (req, res) => {
  try {
    const currentUser = req.user;
    const myOffered = (currentUser.skillsOffered || []).map((s) =>
      s.toLowerCase()
    );
    const myWanted = (currentUser.skillsWanted || []).map((s) =>
      s.toLowerCase()
    );

    const candidates = await User.find({ _id: { $ne: currentUser._id } }).select(
      '-password'
    );

    const matches = candidates
      .map((peer) => {
        const peerOffered = (peer.skillsOffered || []).map((s) =>
          s.toLowerCase()
        );
        const peerWanted = (peer.skillsWanted || []).map((s) =>
          s.toLowerCase()
        );

        // Skills peer can teach me
        const canTeachMe = (peer.skillsOffered || []).filter((s) =>
          myWanted.includes(s.toLowerCase())
        );

        // Skills I can teach peer
        const iCanTeach = (currentUser.skillsOffered || []).filter((s) =>
          peerWanted.includes(s.toLowerCase())
        );

        const isMutual = canTeachMe.length > 0 && iCanTeach.length > 0;
        const matchScore = canTeachMe.length * 2 + iCanTeach.length * 1.5;

        return {
          ...peer.toObject(),
          canTeachMe,
          iCanTeach,
          isMutual,
          matchScore,
        };
      })
      .filter((item) => item.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    return res.json(matches);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateProfile,
  getAllUsers,
  getSkillMatches,
};
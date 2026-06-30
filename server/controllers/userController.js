const User = require('../models/User');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Certification = require('../models/Certification');
const Goal = require('../models/Goal');
const asyncHandler = require('../middleware/asyncHandler');

// @desc Update own profile
// @route PUT /api/users/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, bio } = req.body;
  const updates = { name, bio };
  if (req.file) updates.avatarUrl = `/uploads/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
});

// @desc Aggregated dashboard analytics for the logged-in user
// @route GET /api/users/dashboard
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [skills, projects, certifications, goals] = await Promise.all([
    Skill.find({ user: userId }),
    Project.countDocuments({ user: userId }),
    Certification.countDocuments({ user: userId }),
    Goal.find({ user: userId }),
  ]);

  const avgProficiency =
    skills.length > 0
      ? Math.round(skills.reduce((sum, s) => sum + s.proficiency, 0) / skills.length)
      : 0;

  const skillsByCategory = skills.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {});

  const goalsCompleted = goals.filter((g) => g.status === 'Completed').length;

  res.status(200).json({
    success: true,
    data: {
      totalSkills: skills.length,
      avgProficiency,
      skillsByCategory,
      totalProjects: projects,
      totalCertifications: certifications,
      totalGoals: goals.length,
      goalsCompleted,
      topSkills: [...skills].sort((a, b) => b.proficiency - a.proficiency).slice(0, 5),
    },
  });
});

// ---- Admin only ----

// @desc Get all users
// @route GET /api/users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const query = {};
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(query).sort('-createdAt').skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: users,
  });
});

// @desc Delete a user (and cascade their data)
// @route DELETE /api/users/:id
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot delete an admin account');
  }

  await Promise.all([
    Skill.deleteMany({ user: user._id }),
    Project.deleteMany({ user: user._id }),
    Certification.deleteMany({ user: user._id }),
    Goal.deleteMany({ user: user._id }),
    user.deleteOne(),
  ]);

  res.status(200).json({ success: true, data: {} });
});

// @desc Platform-wide statistics for admin overview
// @route GET /api/users/admin/stats
exports.getPlatformStats = asyncHandler(async (req, res) => {
  const [userCount, skillCount, projectCount, certCount, goalCount] = await Promise.all([
    User.countDocuments(),
    Skill.countDocuments(),
    Project.countDocuments(),
    Certification.countDocuments(),
    Goal.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: { userCount, skillCount, projectCount, certCount, goalCount },
  });
});

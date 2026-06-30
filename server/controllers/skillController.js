const Skill = require('../models/Skill');
const asyncHandler = require('../middleware/asyncHandler');

// @desc Get all skills for logged-in user (supports search, category filter, pagination)
// @route GET /api/skills
exports.getSkills = asyncHandler(async (req, res) => {
  const { search, category, page = 1, limit = 12 } = req.query;

  const query = { user: req.user.id };
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);

  const [skills, total] = await Promise.all([
    Skill.find(query).sort('-createdAt').skip(skip).limit(Number(limit)),
    Skill.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: skills.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: skills,
  });
});

// @desc Get single skill
// @route GET /api/skills/:id
exports.getSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findOne({ _id: req.params.id, user: req.user.id });
  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }
  res.status(200).json({ success: true, data: skill });
});

// @desc Create skill
// @route POST /api/skills
exports.createSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.create({ ...req.body, user: req.user.id });
  res.status(201).json({ success: true, data: skill });
});

// @desc Update skill (including progress tracking)
// @route PUT /api/skills/:id
exports.updateSkill = asyncHandler(async (req, res) => {
  let skill = await Skill.findOne({ _id: req.params.id, user: req.user.id });
  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }
  skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: skill });
});

// @desc Delete skill
// @route DELETE /api/skills/:id
exports.deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findOne({ _id: req.params.id, user: req.user.id });
  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }
  await skill.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

const Goal = require('../models/Goal');
const asyncHandler = require('../middleware/asyncHandler');

exports.getGoals = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 12 } = req.query;
  const query = { user: req.user.id };
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [goals, total] = await Promise.all([
    Goal.find(query).populate('relatedSkill', 'name').sort('targetDate').skip(skip).limit(Number(limit)),
    Goal.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: goals.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: goals,
  });
});

exports.createGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.create({ ...req.body, user: req.user.id });
  res.status(201).json({ success: true, data: goal });
});

exports.updateGoal = asyncHandler(async (req, res) => {
  let goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }
  goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: goal });
});

exports.deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }
  await goal.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

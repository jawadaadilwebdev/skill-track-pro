const Project = require('../models/Project');
const asyncHandler = require('../middleware/asyncHandler');

exports.getProjects = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 12 } = req.query;
  const query = { user: req.user.id };
  if (status) query.status = status;
  if (search) query.title = { $regex: search, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);
  const [projects, total] = await Promise.all([
    Project.find(query).populate('relatedSkills', 'name category').sort('-createdAt').skip(skip).limit(Number(limit)),
    Project.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: projects.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: projects,
  });
});

exports.getProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, user: req.user.id }).populate(
    'relatedSkills',
    'name category'
  );
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  res.status(200).json({ success: true, data: project });
});

exports.createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({ ...req.body, user: req.user.id });
  res.status(201).json({ success: true, data: project });
});

exports.updateProject = asyncHandler(async (req, res) => {
  let project = await Project.findOne({ _id: req.params.id, user: req.user.id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: project });
});

exports.deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, user: req.user.id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  await project.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

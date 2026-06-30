const Certification = require('../models/Certification');
const asyncHandler = require('../middleware/asyncHandler');

exports.getCertifications = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 12 } = req.query;
  const query = { user: req.user.id };
  if (search) query.title = { $regex: search, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Certification.find(query).sort('-issueDate').skip(skip).limit(Number(limit)),
    Certification.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: items.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: items,
  });
});

exports.createCertification = asyncHandler(async (req, res) => {
  const payload = { ...req.body, user: req.user.id };
  if (req.file) payload.fileUrl = `/uploads/${req.file.filename}`;
  const cert = await Certification.create(payload);
  res.status(201).json({ success: true, data: cert });
});

exports.updateCertification = asyncHandler(async (req, res) => {
  let cert = await Certification.findOne({ _id: req.params.id, user: req.user.id });
  if (!cert) {
    res.status(404);
    throw new Error('Certification not found');
  }
  const payload = { ...req.body };
  if (req.file) payload.fileUrl = `/uploads/${req.file.filename}`;
  cert = await Certification.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: cert });
});

exports.deleteCertification = asyncHandler(async (req, res) => {
  const cert = await Certification.findOne({ _id: req.params.id, user: req.user.id });
  if (!cert) {
    res.status(404);
    throw new Error('Certification not found');
  }
  await cert.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

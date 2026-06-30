const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    issuer: { type: String, required: true, trim: true, maxlength: 120 },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date },
    credentialUrl: { type: String, default: '' },
    fileUrl: { type: String, default: '' }, // uploaded certificate file/image
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certification', certificationSchema);

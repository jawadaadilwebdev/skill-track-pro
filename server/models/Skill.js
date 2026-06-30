const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: [true, 'Skill name is required'], trim: true, maxlength: 80 },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'DevOps', 'Database', 'Mobile', 'Design', 'Soft Skill', 'Other'],
      default: 'Other',
    },
    proficiency: { type: Number, min: 0, max: 100, default: 0 }, // progress 0-100
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner',
    },
    notes: { type: String, maxlength: 500, default: '' },
  },
  { timestamps: true }
);

skillSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Skill', skillSchema);

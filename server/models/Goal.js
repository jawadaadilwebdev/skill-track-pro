const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, maxlength: 500, default: '' },
    targetDate: { type: Date },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started',
    },
    relatedSkill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);

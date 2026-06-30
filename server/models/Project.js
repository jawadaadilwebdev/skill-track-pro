const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, maxlength: 1000, default: '' },
    techStack: [{ type: String, trim: true }],
    repoUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Planned', 'In Progress', 'Completed'],
      default: 'In Progress',
    },
    relatedSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);

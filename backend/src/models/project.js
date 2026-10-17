const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 60,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 300,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skillsNeeded: {
      type: [String],
      default: [],
      validate: {
        validator: (list) => list.length <= 10,
        message: 'You can list up to 10 skills',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in_progress', 'done'],
        message: '{VALUE} is not a valid status',
      },
      default: 'open',
    },
    maxMembers: {
      type: Number,
      default: 4,
      min: 2,
      max: 10,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

projectSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
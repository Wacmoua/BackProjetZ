const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    message: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  const comment = mongoose.model('comment', commentSchema);

module.exports = comment;
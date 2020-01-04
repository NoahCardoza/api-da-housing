const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: String,
  date: {
    type: Date,
    default: Date.now,
  },
  serviceProvider: {
    name: String,
    phone: String,
    email: String,
  },
});

module.exports = mongoose.model('issue', IssueSchema);

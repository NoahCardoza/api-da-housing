const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  source: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  author: {
    required: true,
    type: String,
  },
  comments: [String],
});

module.exports = mongoose.model('favorite', FavoriteSchema);

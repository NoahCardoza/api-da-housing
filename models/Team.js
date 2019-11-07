const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
  budget: Number,
  favorites: [mongoose.Schema.Types.ObjectId],
});

module.exports = mongoose.model('team', TeamSchema);

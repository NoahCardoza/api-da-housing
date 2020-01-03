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
  currentHome: mongoose.Schema.Types.ObjectId,
  issues: [mongoose.Schema.Types.ObjectId],
  posts: [mongoose.Schema.Types.ObjectId],
});

/**
 * Delete Teams with no members.
 */
TeamSchema.post('find', async function(_docs) {
  const teamMembers = this.members;
  if (Array.isArray(teamMembers) && teamMembers.length) {
    this.remove();
  }
});

module.exports = mongoose.model('team', TeamSchema);

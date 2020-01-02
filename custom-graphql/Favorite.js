const User = require('../models/User');
const Team = require('../models/Team');

const Favorite = {
  author: async parent => User.findById(parent.author).exec(),
  team: async parent => Team.findById(parent.team).exec(),
};

module.exports = Favorite;

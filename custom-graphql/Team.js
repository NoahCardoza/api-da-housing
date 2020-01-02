const User = require('../models/User');
const Favorite = require('../models/Favorite');

const Team = {
  members: async parent =>
    User.find()
      .where('_id')
      .in(parent.members)
      .exec(),
  favorites: async parent =>
    Favorite.find({ team: parent._id }).exec(),
};

module.exports = Team;

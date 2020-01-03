const User = require('../models/User');
const Favorite = require('../models/Favorite');
const Listing = require('../models/Listing');

const Team = {
  members: async parent =>
    User.find()
      .where('_id')
      .in(parent.members)
      .exec(),
  favorites: async parent =>
    Favorite.find({ team: parent._id }).exec(),
  currentHome: async parent =>
    Listing.findById(parent.currentHome).exec(),
};

module.exports = Team;

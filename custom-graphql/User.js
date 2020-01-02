const Listing = require('../models/Listing');

const User = {
  favoriteListings: async (parent) => Listing.find().where('_id').in(parent.favoriteListings).exec(),
};

module.exports = User;

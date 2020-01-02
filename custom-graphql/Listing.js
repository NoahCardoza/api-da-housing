const User = require('../models/User');

const Listing = {
  author: async parent => User.findById(parent.author).exec(),
};

module.exports = Listing;

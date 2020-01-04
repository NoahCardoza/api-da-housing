const User = require('../models/User');
const Favorite = require('../models/Favorite');
const Listing = require('../models/Listing');
const Issue = require('../models/Issue');
const Post = require('../models/Post');

const Team = {
  members: async parent =>
    User.find()
      .where('_id')
      .in(parent.members)
      .exec(),
  favorites: async parent =>
    Favorite.find({ team: parent._id }).exec(),
  home: async parent => Listing.findById(parent.home).exec(),
  issues: async parent =>
    Issue.find()
      .where('_id')
      .in(parent.issues)
      .exec(),
  posts: async parent =>
    Post.find()
      .where('_id')
      .in(parent.posts)
      .exec(),
};

module.exports = Team;

import User from '../models/User';
import Favorite from '../models/Favorite';
import Listing from '../models/Listing';
import Issue from '../models/Issue';
import Post from '../models/Post';

export default {
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

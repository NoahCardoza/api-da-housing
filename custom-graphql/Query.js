const User = require('../models/User');
const Listing = require('../models/Listing');
const Team = require('../models/Team');

const Query = {
  user: async (parent, args, context) => {
    try {
      if (!context.user) return null;
      if (!context.user.profilePicture) {
        return {
          ...context.user._doc,
          profilePicture: 'https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar.png',
        };
      }
      return context.user;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  },
  login: async (parent, args) => {
    try {
      const user = await User.findOne({
        email: args.email,
      });
      if (user === null) throw new Error('User not found');
      const result = await user.comparePassword(args.password);
      if (result === true) return user.generateAuthToken();
      throw new Error('Credentials Have Failed');
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  },
  listing: async (parent, args) => {
    try {
      return Listing.findById(args.id).exec();
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  },
  team: async (parent, args, context) => {
    try {
      const team = await Team.findOne({
        _id: args.id,
        members: context.user._id,
      }).exec();
      return team;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  },
};

module.exports = Query;

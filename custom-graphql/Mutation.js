const User = require('../models/User');
const Listing = require('../models/Listing');
const Team = require('../models/Team');
const Favorite = require('../models/Favorite');

const Mutation = {
  user: async (parent, args, context) => {
    try {
      if (!context.user) {
        return new User(args).save();
      }
      return User.findByIdAndUpdate(context.user._id, args).exec();
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  },
  listing: async (parent, args, context) => {
    try {
      if (context.user && !args.id) {
        const {
          name,
          price,
          images,
          description,
          street,
          city,
          zipcode,
          latitude,
          longitude,
        } = args;
        return new Listing({
          author: context.user._doc._id,
          name,
          price,
          images,
          description,
          address: {
            street,
            city,
            zipcode,
            coordinates: {
              latitude,
              longitude,
            },
          },
        }).save();
      }
      if (context.user && args.id) {
        return Listing.findOneAndUpdate(
          { author: context.user._doc._id, _id: args.id },
          args,
        ).exec();
      }
      throw new Error('Unauthenticated request');
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  },
  team: async (parent, args, context) => {
    if (context.user._id) {
      if (args.id) {
        const team = Team.findOne({
          id: args.id,
          members: context.user._id,
        }).exec();
        if (team) {
          return Team.findByIdAndUpdate(args.id, args).exec();
        }
      }
      return new Team(args).save();
    }
    return new Error('User not authenticated');
  },
  favorite: async (parent, args, context) => {
    try {
      if (context.user._id && args.id) {
        return Favorite.findOneAndUpdate(
          { author: context.user._doc._id, _id: args.id },
          args,
        ).exec();
      }
      if (context.user._id && args.team) {
        const team = await Team.findOne({
          _id: args.team,
          members: context.user._id,
        }).exec();
        if (team) {
          return new Favorite({
            ...args,
            author: context.user._id,
          }).save();
        }

        return new Error(
          'You are not a member of that Team or it does not exists!',
        );
      }
      return new Error('User not authenticated');
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  },
};

module.exports = Mutation;

import User, { UserDoc } from '../models/User';
import Listing from '../models/Listing';
import Team from '../models/Team';
import Favorite, { FavoriteDoc } from '../models/Favorite';
import Issue from '../models/Issue';
import Post from '../models/Post';

export default {
  user: async (parent: any, args: any, context: any) => {
    try {
      if (!context.user) return null;
      if (!context.user.profilePicture) {
        return {
          ...context.user._doc,
          profilePicture:
            'https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar.png',
        };
      }
      return context.user;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  },
  login: async (parent: any, args: any) => {
    try {
      const user = await User.findOne({
        email: args.email,
      }) as UserDoc;
      if (user === null) throw new Error('User not found');
      const result = await user.comparePassword(args.password);
      if (result === true) return user.generateAuthToken();
      throw new Error('Credentials Have Failed');
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  },
  listing: async (parent: any, args: any) => {
    try {
      return Listing.findById(args.id).exec();
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  },
  team: async (parent: any, args: any, context: any) => {
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
  teamsWithMe: async (parent: any, args: any, context: any) => {
    try {
      const team = await Team.find({
        members: context.user._id,
      }).exec();
      return team;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  },
  issuesWithMe: async (parent: any, args: any, context: any) => {
    try {
      const issues = await Issue.find({
        author: context.user._id,
      }).exec();
      return issues;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  },
  postsWithMe: async (parent: any, args: any, context: any) => {
    try {
      const posts = await Post.find({
        author: context.user._id,
      }).exec();
      return posts;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  },
  listingsWithMe: async (parent: any, args: any, context: any) => {
    try {
      const listings = await Listing.find({
        author: context.user._id,
      }).exec();
      return listings;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  },
  favorite: async (parent: any, args: any, context: any) => {
    try {
      if (context.user) {
        const favorite = await Favorite.findOne({
          _id: args.id,
        }).exec() as FavoriteDoc;
        const team = await Team.findOne({
          _id: favorite.team,
          members: context.user._id,
        }).exec();
        if (team && favorite) {
          return favorite;
        }
        return null;
      }
      return null;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  },
};

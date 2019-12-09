const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const ListingModel = require('../models/Listing');
const TeamModel = require('../models/Team');

module.exports.auth = async (req, res, next) => {
  try {
    if (req.header('Authorization')) {
      const token = req.header('Authorization').replace('Bearer ', '');
      const data = jwt.verify(token, process.env.SECRET);
      const user = await UserModel.findOne({
        _id: data._id,
        'tokens.token': token,
      }).exec();
      if (!user) throw new Error('Credentials failed.');
      user.password = undefined;
      user.tokens = undefined;
      req.user = user;
      return next();
    }
    throw new Error('Missing Bearer Token for Authorization');
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};

module.exports.isListingOwner = async (req, res, next) => {
  try {
    if (req.header('Authorization')) {
      const token = req.header('Authorization').replace('Bearer ', '');
      const data = jwt.verify(token, process.env.SECRET);
      const listingID = req.params.listingid;
      const listing = await ListingModel.findOne({
        _id: listingID,
        author: data._id,
      }).exec();
      if (!listing) throw new Error('Credentials failed.');
      req.listing = listing;
      return next();
    }
    throw new Error('Missing Bearer Token for Authorization');
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports.isTeamMember = async (req, res, next) => {
  try {
    if (req.header('Authorization')) {
      const token = req.header('Authorization').replace('Bearer ', '');
      const data = jwt.verify(token, process.env.SECRET);
      const teamID = req.params.teamid;
      const team = await TeamModel.findOne({
        _id: teamID,
        members: data._id,
      }).exec();
      if (!team) throw new Error('The Team either does not exist or you are not a member');
      req.team = team;
      return next();
    }
    throw new Error('Missing Bearer Token for Authorization');
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

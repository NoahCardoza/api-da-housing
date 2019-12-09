const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const ListingModel = require('../models/Listing');
const TeamModel = require('../models/Team');

module.exports.softAuthorization = async (req, res, next) => {
  try {
    if (req.header('Authorization')) {
      const token = req.header('Authorization').replace('Bearer ', '');
      const data = jwt.verify(token, process.env.SECRET);
      const user = await UserModel.findOne({
        _id: data._id,
        'tokens.token': token,
      }).exec();
      if (!user) req.user = null;
      req.user = user;
      req.token = token;
      return next();
    }
    req.user = null;
    req.token = null;
    return next();
  } catch (error) {
    console.error(error.message);
    return res.status(500).send(error.message);
  }
};

module.exports.auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, process.env.SECRET);
    const user = await UserModel.findOne({
      _id: data._id,
      'tokens.token': token,
    }).exec();
    if (!user) throw new Error('Credentials failed.');
    req.user = user;
    req.token = token;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).send('Your credentials have failed the auth layer.');
  }
};

module.exports.isListingOwner = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, process.env.SECRET);
    const listingID = req.params.listingid;
    const listing = await ListingModel.findOne({
      _id: listingID,
      author: data._id,
    }).exec();
    if (!listing) throw new Error('Credentials failed.');
    req.listing = listing;
    req.token = token;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).send('Your credentials have failed the auth layer.');
  }
};

module.exports.isTeamMember = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, process.env.SECRET);
    const teamID = req.params.teamid;
    const team = await TeamModel.findOne({
      _id: teamID,
      members: data._id,
    }).exec();
    if (!team) throw new Error('Credentials failed team.');
    req.team = team;
    req.token = token;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).send('Your credentials have failed the auth layer.');
  }
};

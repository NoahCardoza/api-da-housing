const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const ListingModel = require('../models/Listing');
const TeamModel = require('../models/Team');
const FavoriteModel = require('../models/Favorite');

/**
 * @param {*} param0 - request context
 * takes request contexts and strips
 * jwt token from Authorization headers.
 */
function processBearer(req) {
  const containsBearerToken = req.header('Authorization') && req.header('Authorization').includes('Bearer');
  return containsBearerToken
    ? req.header('Authorization').replace('Bearer ', '')
    : (() => new Error('Either something went wrong when parsing the Bearer Token or it does not exist'))();
}


module.exports.auth = async (req, res, next) => {
  try {
    const token = processBearer(req);
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
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};

module.exports.isListingOwner = async (req, res, next) => {
  try {
    const token = processBearer(req);
    const data = jwt.verify(token, process.env.SECRET);
    const listingID = req.params.listingid;
    const listing = await ListingModel.findOne({
      _id: listingID,
      author: data._id,
    }).exec();
    if (!listing) throw new Error('Listing not found.');
    req.listing = listing;
    return next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// todo: needs improvements should probably let operations move forward.
module.exports.isTeamMember = async (req, res, next) => {
  try {
    const token = processBearer(req);
    const data = jwt.verify(token, process.env.SECRET);
    console.log(data)
    const teamID = req.params.id;
    const team = await TeamModel.findOne({
      _id: teamID,
      members: data._id
    }).exec();    
    console.log(teamID)
    if (!team) throw new Error('The Team either does not exist or you are not a member');
    req.team = team;
    return next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

/** Allows operations on Favorites if the user is a author of a favorite */
module.exports.isFavoriteAuthor = async (req, res, next) => {
  try {
    const token = processBearer(req);
    const data = jwt.verify(token, process.env.SECRET);
    const favoriteID = req.params.id;
    const favorite = await FavoriteModel.findOne({
      _id: favoriteID,
      author: data._id,
    }).exec();
    if (!favorite) throw new Error('Favorite not found.');
    return next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

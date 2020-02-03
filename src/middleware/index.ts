import jwt from 'jsonwebtoken';
import UserModel, { UserDoc } from '../models/User';
import ListingModel, { ListingDoc } from '../models/Listing';
import TeamModel, { TeamDoc } from '../models/Team';
import FavoriteModel, { FavoriteDoc } from '../models/Favorite';
import express from 'express';

import { iToken } from '../interfaces/jwt';
import { iUserRequest } from '../interfaces/requests';

/**
 * takes request contexts and strips
 * jwt token from Authorization headers.
 * @param req - express request object
 */
function processBearer(req: express.Request): string {
  const containsBearerToken =
    req.header('Authorization') &&
    req.header('Authorization').includes('Bearer');
  
  if (containsBearerToken) {
    return req.header('Authorization').replace('Bearer ', '')
  }

  throw new Error(
    'Either something went wrong when parsing the Bearer Token or it does not exist',
  )
}

export const auth = async (req: iUserRequest, res: express.Response, next: express.NextFunction) => {
  try {
    const token: string = processBearer(req);
    const data = jwt.verify(token, process.env.SECRET) as iToken;
    const user: UserDoc = await UserModel.findOne({
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

export const isListingOwner = async (req: iUserRequest, res: express.Response, next: express.NextFunction) => {
  try {
    const token = processBearer(req);
    const data = jwt.verify(token, process.env.SECRET) as iToken;
    const listingID = req.params.listingid;
    const listing = await ListingModel.findOne({
      _id: listingID,
      author: data._id,
    }).exec() as ListingDoc;
    if (!listing) throw new Error('Listing not found.');
    req.listing = listing;
    return next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// todo: needs improvements should probably let operations move forward.
export const isTeamMember = async (req: iUserRequest, res: express.Response, next: express.NextFunction) => {
  try {
    const token = processBearer(req);
    const data = jwt.verify(token, process.env.SECRET) as iToken;
    const teamID = req.params.id;
    const team = await TeamModel.findOne({
      _id: teamID,
      members: data._id,
    }).exec() as TeamDoc;
    if (!team)
      throw new Error(
        'The Team either does not exist or you are not a member',
      );
    req.team = team;
    return next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

/** Allows operations on Favorites if the user is a author of a favorite */
export const isFavoriteAuthor = async (req: iUserRequest, res: express.Response, next: express.NextFunction) => {
  try {
    const token = processBearer(req);
    const data = jwt.verify(token, process.env.SECRET) as iToken;
    const favoriteID = req.params.id;
    const favorite = await FavoriteModel.findOne({
      _id: favoriteID,
      author: data._id,
    }).exec() as FavoriteDoc;
    if (!favorite) throw new Error('Favorite not found.');
    return next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

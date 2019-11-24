import jwt from 'jsonwebtoken';
import UserModel, { IUserModel } from '../models/User';
import ListingModel, { IListingModel } from '../models/Listing';
import TeamModel, { ITeamModel } from '../models/Team';
import { ITokenMiddleware } from '../interfaces';

export const auth = async (req: any, res: any, next: any) => {
  try {
    const token: string = req.header('Authorization').replace('Bearer ', '');
    const data: ITokenMiddleware = <ITokenMiddleware>jwt.verify(token, process.env.SECRET);
    const user: IUserModel = await UserModel.findOne({
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

export const isListingOwner = async (req: any, res: any, next: any) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data: ITokenMiddleware = <ITokenMiddleware>jwt.verify(token, process.env.SECRET);
    const listingID = req.params.listingid;
    const listing: IListingModel = await ListingModel.findOne({
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

export const isTeamMember = async (req: any, res: any, next: any) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data: ITokenMiddleware = <ITokenMiddleware>jwt.verify(token, process.env.SECRET);
    const teamID = req.params.teamid;
    const team: ITeamModel = await TeamModel.findOne({
      _id: teamID,
      members: data._id,
    }).exec();
    if (!team) throw new Error('Credentials failed.');
    req.team = team;
    req.token = token;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).send('Your credentials have failed the auth layer.');
  }
};

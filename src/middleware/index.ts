import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ITokenMiddleware } from "../interfaces";
import ListingModel, { IListingModel } from "../models/Listing";
import TeamModel, { ITeamModel } from "../models/Team";
import UserModel, { IUserModel } from "../models/User";

/**
 * Used by middleware to validate actions must be kept in the same file.
 */
export interface ICustomMiddleWareRequest extends Request {
  user?: IUserModel;
  listing?: IListingModel;
  team?: ITeamModel;
  token?: string;
}

export const auth = async (req: ICustomMiddleWareRequest, res: Response, next: any) => {
  try {
    const token: string = req.header("Authorization").replace("Bearer ", "");
    const data: ITokenMiddleware = jwt.verify(token, process.env.SECRET) as ITokenMiddleware;
    const user: IUserModel = await UserModel.findOne({
      "_id": data._id,
      "tokens.token": token,
    }).exec();
    if (!user) { throw new Error("Credentials failed."); }
    req.user = user;
    req.token = token;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

export const isListingOwner = async (req: ICustomMiddleWareRequest, res: Response, next: any) => {
  try {
    const token: string = req.header("Authorization").replace("Bearer ", "");
    const data: ITokenMiddleware = jwt.verify(token, process.env.SECRET) as ITokenMiddleware;
    const listingID: string = req.params.listingid;
    const listing: IListingModel = await ListingModel.findOne({
      _id: listingID,
      author: data._id,
    }).exec();
    if (!listing) { throw new Error("Credentials failed."); }
    req.listing = listing;
    req.token = token;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

export const isTeamMember = async (req: ICustomMiddleWareRequest, res: Response, next: any) => {
  try {
    const token: string = req.header("Authorization").replace("Bearer ", "");
    const data: ITokenMiddleware = jwt.verify(token, process.env.SECRET) as ITokenMiddleware;
    const teamID: string = req.params.teamid;
    const team: ITeamModel = await TeamModel.findOne({
      _id: teamID,
      members: data._id,
    }).exec();
    if (!team) { throw new Error("Credentials failed team."); }
    req.team = team;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

import mongoose, { Document, Model, model, Schema } from "mongoose";
import FavoriteModel from "../models/Favorites";
import { ITeam } from "../interfaces";

export interface ITeamModel extends ITeam, Document {
}

const TeamSchema: Schema = new mongoose.Schema({
  name: String,
  members: [mongoose.Schema.Types.ObjectId],
  budget: Number,
  favorites: [mongoose.Schema.Types.ObjectId],
});

/**
 * Deletes any comments associated or
 * belonging to the team on deletion
 */
TeamSchema.post("remove", async (document) => {
  await FavoriteModel.deleteMany({ team: document._id  }).exec();
});

const Team: Model<ITeamModel> = model<ITeamModel>("Team", TeamSchema);

export default Team;

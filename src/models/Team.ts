import mongoose, { Document, Model, model, Schema } from "mongoose";
import { ITeam } from "../interfaces";

export interface ITeamModel extends ITeam, Document {
}

const TeamSchema: Schema = new mongoose.Schema({
  name: String,
  members: [mongoose.Schema.Types.ObjectId],
  budget: Number,
  favorites: [mongoose.Schema.Types.ObjectId],
});

const Team: Model<ITeamModel> = model<ITeamModel>("Team", TeamSchema);

export default Team;

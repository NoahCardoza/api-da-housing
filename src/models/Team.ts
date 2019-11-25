import mongoose, { Document, Model, model, Schema } from "mongoose";
import { ITeam } from "../interfaces";

export interface ITeamModel extends ITeam, Document {
}

const TeamSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
  budget: Number,
  favorites: [{
    source: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      required: true,
      type: String,
    },
    comments: [String],
  }],
  outsideFavorites: [{
    source: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    comments: [String],
  }],
});

const Team: Model<ITeamModel> = model<ITeamModel>("Team", TeamSchema);

export default Team;

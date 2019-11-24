import mongoose from 'mongoose';
import { ITeam } from '../interfaces';

export interface ITeamModel extends ITeam, Document {
}

const TeamSchema = new mongoose.Schema({
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
      type: [mongoose.Schema.Types.ObjectId],
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

export default mongoose.model('team', TeamSchema);

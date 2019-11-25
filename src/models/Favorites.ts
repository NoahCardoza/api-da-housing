import mongoose, { Document, Model, model, Schema } from "mongoose";
import { IFavorite } from "../interfaces";

export interface IFavoriteModel extends IFavorite, Document {
}

// favorites: [{
//     source: {
//       required: true,
//       type: mongoose.Schema.Types.ObjectId,
//     },
//     name: {
//       required: true,
//       type: String,
//     },
//     comments: [String],
//   }],
import mongoose, { Document, Model, model, Schema, mongo } from "mongoose";
import { IFavorite } from "../interfaces";

export interface IFavoriteModel extends IFavorite, Document {
}

/**
 * Representation of a Favorite Listing
 * in the Mongoose ORM.
 */
const FavoriteSchema: Schema = new mongoose.Schema({
    source: {
        required: true,
        type: String,
    },
    name: {
        required: true,
        type: String,
    },
    comments: [String],
    team: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const Favorite: Model<IFavoriteModel> = model<IFavoriteModel>("Favorites", FavoriteSchema);

export default Favorite;

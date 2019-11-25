import mongoose, { Document, Model, model, Schema } from "mongoose";
import { IFavorite } from "../interfaces";

export interface IFavoriteModel extends IFavorite, Document {
}

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
});

const Favorite: Model<IFavoriteModel> = model<IFavoriteModel>("Favorites", FavoriteSchema);

export default Favorite;
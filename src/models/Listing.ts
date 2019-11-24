import mongoose, { Document, Model, model, Schema } from "mongoose";
import { IListing } from "../interfaces";
export interface IListingModel extends IListing, Document {
}

const ListingSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
  },
  description: {
    required: true,
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  address: {
    street: String,
    city: String,
    zipcode: Number,
    longitude: Number,
    latitiude: Number,
  },
});

const Listing: Model<IListingModel> = model<IListingModel>("Listing", ListingSchema);

export default Listing;

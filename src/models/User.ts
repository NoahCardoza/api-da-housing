/* eslint-disable func-names */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { Document, Model, model, Schema } from "mongoose";
import { IUser } from "../interfaces";

/**
 * User interface definition
 */
export interface IUserModel extends IUser, Document {
  generateAuthToken(): Promise<string>;
  comparePassword(plaintext: string): Promise<boolean>;
}

const UserSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  school: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  favoriteListings: [mongoose.Schema.Types.ObjectId],
  preferences: [String],
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
});

UserSchema.pre("save", async function(next): Promise<void> {
  try {
    if (!this.isModified("password")) { return next(); }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return next();
  } catch (error) {
    console.error(error);
    return error;
  }
});

UserSchema.methods.generateAuthToken = async function(): Promise<string> {
  try {
    const token = jwt.sign({
      _id: this._id,
    }, process.env.SECRET);
    // allows user to be logged in on multiple devices
    this.tokens = this.tokens.concat({
      token,
    });
    await this.save();
    return token;
  } catch (err) {
    console.error(err);
    return err;
  }
};

UserSchema.methods.comparePassword = async function(plaintext: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plaintext, this.password);
  } catch (err) {
    console.error(err);
    return err;
  }
};

const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);

export default User;

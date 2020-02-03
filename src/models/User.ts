/* eslint-disable func-names */
import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OrganizationSchema } from './Organization';
import { FavoriteSchema } from './Favorite';

export const UserSchema = createSchema({
  email: Type.string({ required: true, unique: true }),
  location: Type.string(),
  verifications: Type.array().of(Type.string()),
  languages: Type.array().of(Type.string()),
  job: Type.string(),
  lifeStyleBeliefs: Type.array().of(Type.string()),
  privateFields: Type.array().of(Type.string()),
  biography: Type.string(),
  organization: Type.ref(Type.objectId()).to('Organization', OrganizationSchema),
  gender: Type.string({ required: true }),
  password: Type.string({ required: true }),
  name: Type.string({ required: true }),
  profilePicture: Type.string(),
  personalGallery: Type.array().of(Type.string()),
  favoriteListings: Type.array().of(Type.ref(Type.objectId()).to('Favorite', FavoriteSchema)),
  preferences: Type.array().of(Type.string()),
  tokens: [
    {
      token: Type.string({ required: true }),
    },
  ],
});

export type UserDoc = ExtractDoc<typeof UserSchema>

/**
 * @param {*} password - plaintext password to be hashed.
 */
const asyncHashPassword = (password: string) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });

/**
 * @param {*} plaintext - plaintext password to compare.
 * @param {*} hashed - hash stored in database to compare.
 */
const asyncComparePassword = (plaintext: string, hashed: string) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(plaintext, hashed, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });

/**
 * hashes user password on save.
 */
UserSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) return next();
    const hash = await asyncHashPassword(this.password);
    this.password = hash;
    return next();
  } catch (error) {
    console.error(error);
    return error;
  }
});

/**
 * Generates valid JWT token.
 */
UserSchema.methods.generateAuthToken = async function() {
  try {
    const { _id } = this;
    const token = jwt.sign({ _id }, process.env.SECRET);
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
};

/**
 * Compares Plaintext Password to Hashed Password in Store.
 */
UserSchema.methods.comparePassword = async function(text) {
  try {
    return asyncComparePassword(text, this.password);
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

export default typedModel('User', UserSchema);

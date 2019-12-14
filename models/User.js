/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
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


/**
 * @param {*} password - plaintext password to be hashed.
 */
const asyncHashPassword = (password) => new Promise((resolve, reject) => {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) reject(err);
    resolve(hash);
  });
});

/**
 * @param {*} plaintext - plaintext password to compare.
 * @param {*} hashed - hash stored in database to compare.
 */
const asyncComparePassword = (plaintext, hashed) => new Promise((resolve, reject) => {
  bcrypt.compare(plaintext, hashed, (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

UserSchema.pre('save', async function (next) {
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

UserSchema.methods.generateAuthToken = async function () {
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
UserSchema.methods.comparePassword = async function (text) {
  try {
    return asyncComparePassword(text, this.password);
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

const User = mongoose.model('user', UserSchema);

module.exports = User;

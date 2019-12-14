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

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    const hash = await bcrypt.hash(this.password, 10);
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
  } catch (err) {
    console.error(err);
    return err;
  }
};

/**
 * Compares Plaintext Password to Hashed Password in Store.
 */
UserSchema.methods.comparePassword = async function (text) {
  return bcrypt
    .compare(text, this.password)
    .then((result) => result)
    .catch((error) => error);
};

const User = mongoose.model('user', UserSchema);

module.exports = User;

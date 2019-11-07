/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
  favorites: [String],
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
});

userSchema.pre('save', async function (next) {
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

userSchema.methods.generateAuthToken = async function () {
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

userSchema.methods.comparePassword = async function (plaintext) {
  try {
    return await bcrypt.compare(plaintext, this.password);
  } catch (err) {
    console.error(err);
    return err;
  }
};

module.exports.userModel = mongoose.model('user', userSchema);
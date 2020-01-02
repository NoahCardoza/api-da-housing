const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokenAuthorizationMiddleware = async ({ req }) => {
  try {
    const TOKEN = (req.headers.authorization || '').replace(
      'Bearer ',
      '',
    );
    const DATA = Object.freeze(jwt.verify(TOKEN, process.env.SECRET));
    const user = await User.findOne({
      _id: DATA._id,
      'tokens.token': TOKEN,
    }).exec();
    return {
      user,
    };
  } catch (error) {
    console.log(error.message);
    return {
      user: null,
    };
  }
};

module.exports = {
  tokenAuthorizationMiddleware,
};

const User = require('../models/User');

const Team = {
  members: async (parent) => User.find().where('_id').in(parent.members).exec(),
};

module.exports = Team;

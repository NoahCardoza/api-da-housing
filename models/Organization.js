const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  location: {
    type: String,
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  administrators: {
    type: [mongoose.Schema.Types.ObjectId],
  },
});

const Organization = mongoose.model('organization', OrganizationSchema);

module.exports = Organization;

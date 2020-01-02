const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
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
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
});

module.exports = mongoose.model('listing', ListingSchema);

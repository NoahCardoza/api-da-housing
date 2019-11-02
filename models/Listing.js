const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   images: {
      type: [String],
      validate: [10, 'exceeds the limit of 10 images.']
   },
   description: {
      required: true,
      type: String
   },
   author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
   }
});


module.exports = mongoose.model("listing", listingSchema);
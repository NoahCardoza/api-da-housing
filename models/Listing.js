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
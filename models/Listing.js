var mongoose = require("mongoose");

var listingSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   post: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Post"
      }
   ]
});

module.exports = mongoose.model("listing", listingSchema);
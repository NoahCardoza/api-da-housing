var Listing = require("../models/Listing");

// middleware goes here
var middlewareObj = {};

middlewareObj.checkListingOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		Listing.findById(req.params.id, function(err, foundListing){
		if(err){
			res.redirect("back");
		} else {
			if (!foundListing) {
				return res.status(400).send("Item not found.")
       		}
			if(foundListing.author.id.equals(req.user._id)){
				next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next()
	}
	res.redirect("/login");
}

module.exports = middlewareObj
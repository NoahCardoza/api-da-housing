var Listing = require("../models/Listing");

module.exports.checkListingOwnership = function (req, res, next) {
	if (req.isAuthenticated()) {
		Listing.findById(req.params.id, function (err, foundListing) {
			if (err) {
				res.redirect("back");
			} else {
				if (!foundListing) {
					return res.status(400).send("Item not found.")
				}
				if (foundListing.author.id.equals(req.user._id)) {
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

module.exports.checkListingOwnership = (req, res, next) => {
	if(!req.isAuthenticated()) return res.status(401); 
	Listing.findById(req.params.id, (err, doc) => {
		c
	});
}

module.exports.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	return res.status(401);
}
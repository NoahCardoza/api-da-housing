const Listing = require("../models/Listing");

module.exports.checkListingOwnership = (req, res, next) => {
	if (!req.isAuthenticated()) return res.status(401);
	Listing.findById(req.params.id, (err, doc) => {
		if (err) return res.status(500);
		if (!doc) return res.status(400);
		if (doc.author.id === req.user._id) return next();
		return res.status(400);
	});
}

module.exports.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	return res.status(401);
}
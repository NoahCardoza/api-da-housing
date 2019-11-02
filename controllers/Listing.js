const express = require("express");
const router = express.Router();
const ListingModel = require("../models/Listing");
const { auth, isListingOwner } = require('../middleware/auth');

// INDEX route - show all listings (READ)
router.get("/listing", async (_, res) => {
	try {
		return res.status(200).json(await ListingModel.find({}));
	} catch (error) {
		console.error(error);
		return res.status(500);
	}
});

router.

// CREATE LISTING
router.post("/create-listing", auth, async (res, req) => {
	try {
		const {
			name,
			price,
			description, 
			address
		} = req.body;
		const newListing = new ListingModel({
			author: req.user._id,
			name,
			price,
			description, 
			address
		});
		newListing.save()
		return res.status(201).json(newListing);
	} catch (err) {
		console.error(err);
		return res.status(500);
	}
});


module.exports = router;
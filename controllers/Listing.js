const express = require("express");
const router = express.Router();
const ListingModel = require("../models/Listing");
const {
	auth,
	isListingOwner
} = require('../middleware/auth');

// INDEX route - show all listings (READ)
router.get("/listing", async (_, res) => {
	try {
		return res.status(200).json(await ListingModel.find({}));
	} catch (error) {
		console.error(error);
		return res.status(500);
	}
});

// READ LISTING BY ID
router.get("/get-listing/:listingid", async (req, res) => {
	try {
		const listing = await ListingModel.findById(req.params.listingid);
		if (!listing) return res.status(400).send('Listing not found.')
		return res.status(200).json(listing);
	} catch (err) {
		console.error(err);
		return res.status(500);
	}
});

// CREATE LISTING
router.post("/create-listing", auth, async (req, res) => {
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
		await newListing.save()
		return res.status(201).json(newListing);
	} catch (err) {
		console.error(err);
		return res.status(500);
	}
});


//UPDATE LISTING 
router.put("/update-listing/:listingid", isListingOwner, async (req, res) => {
	try {
		const listingID = req.listing._id;
		ListingModel.findByIdAndUpdate(listingID, req.body, (err, document) => {
			if (err) return res.status(500).send('Document failed to update');
			return res.status(204).json({
				document,
				message: "Successfully updated"
			});
		});
	} catch (err) {
		console.error(err);
		return res.status(500);
	}
});


// DELETE LISTING
router.delete("/delete-listing/:listingid", isListingOwner, async (req, res) => {
	try {
		// passed in by isListingOwner Middleware.
		const listingID = req.listing._id;
		await ListingModel.findByIdAndDelete(listingID);
		return res.status(202).json({
			message: `${listingID}, successfully queued for deletion.`
		})
	} catch (err) {
		console.error(err);
		return res.status(500);
	}
});

module.exports = router;
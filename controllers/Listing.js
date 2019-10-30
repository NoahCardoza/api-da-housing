const express = require("express");
const router = express.Router();
const ListingModel = require("../models/Listing");
const middleware = require("../middleware");
const {
	isLoggedIn,
	checkListingOwnership
} = require('../middleware')

// INDEX route - show all listings (READ)
router.get("/listing", async (_, res) => {
	try {
		return res.status(200).json(await ListingModel.find({}));
	} catch (error) {
		console.error(error);
		return res.status(500);
	}
});

// CREATE
router.post("/listing", isLoggedIn, async (req, res) => {
	try {
		const {
			name,
			image,
			price,
			description
		} = req.body;
		const {
			id,
			username
		} = req.body.author;
		const newListing = new ListingModel({
			name,
			image,
			price,
			description,
			author: {
				id,
				username
			}
		});
		await newListing.save();
		return res.status(201);
	} catch (error) {
		console.error(error)
		return res.status(500);
	}
})


// SHOW route - presents info
router.get("/:id", function (req, res) {
	//find the listing with provided ID
	Listing.findById(req.params.id, function (err, foundListing) {
		if (err) {
			console.log(err);
		} else {
			if (!foundListing) {
				return res.status(400).send("Item not found.")
			}
			console.log(foundListing);
			//render show template with that listing
			res.send("listings/show") //, {listing: foundListing});
		}
	});
});

// EDIT listing route
router.get("/:id/edit", middleware.checkListingOwnership, function (req, res) {
	Listing.findById(req.params.id, function (err, foundListing) {
		if (!foundListing) {
			return res.status(400).send("Item not found.")
		}
		res.send("listings/edit") // {listing: foundListing});
	});
});

// UPDATE listing route
router.put("/:id", middleware.checkListingOwnership, function (req, res) {
	Listing.findByIdAndUpdate(req.params.id, req.body.listing, function (err, updateListing) {
		if (err) {
			res.redirect("/listings");
		} else {
			if (!updateListing) {
				return res.status(400).send("Item not found.")
			}
			res.redirect("/listings/" + req.params.id);
		}
	})
})

// DESTROY listing route
router.delete("/:id", middleware.checkListingOwnership, function (req, res) {
	Listing.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			res.redirect("/listings");
		} else {
			res.redirect("/listings");
		}
	})
});

module.exports = router;
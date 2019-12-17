const express = require('express');

const router = express.Router();
const ListingModel = require('../models/Listing');
const { auth, isListingOwner } = require('../middleware');

/** Create Route for Listing Resource */
router.post('/listing', auth, async (req, res) => {
  try {
    const {
      name, price, description, address,
    } = req.body;
    const newListing = new ListingModel({
      author: req.user._id,
      name,
      price,
      description,
      address,
    });
    await newListing.save();
    return res.status(201).json(newListing);
  } catch (err) {
    console.error(err);
    return res.status(500);
  }
});

/** Read Route for Listing resource */
router.get('/listing', async (req, res) => {
  try {
    if (req.query.id) {
      // if id query param detected return the given Listing
      return res.status(200).json(await ListingModel.findById(req.query.id).exec());
    }
    // return all listings
    return res.status(200).json(await ListingModel.find({}).exec());
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
});

// UPDATE LISTING
router.put('/update-listing/:listingid', isListingOwner, async (req, res) => {
  try {
    const listingID = req.listing._id;
    const listing = await ListingModel.findByIdAndUpdate(listingID, req.body).exec();
    return res.status(204).json({
      message: 'Document successfully updated.',
      listing,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Document failed to update');
  }
});

// DELETE LISTING
router.delete('/delete-listing/:listingid', isListingOwner, async (req, res) => {
  try {
    // passed in by isListingOwner Middleware.
    const listingID = req.listing._id;
    await ListingModel.findByIdAndDelete(listingID).exec();
    return res.status(202).json({
      message: `${listingID}, successfully queued for deletion.`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500);
  }
});

module.exports = router;

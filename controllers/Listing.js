const express = require('express');

const router = express.Router();
const ListingModel = require('../models/Listing');
const { auth, isListingOwner } = require('../middleware');

/**
 * @swagger
 * /listing:
 *  post:
 *    description: Create Route for Listing resource.
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "body"
 *      name: "body"
 *      description: A object containing  name, price, description and address properties.
 *    responses:
 *      '201':
 *            description: An object containing a Listing.
 *      '500':
 *            description: server error
 */
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
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/** Read Route for Listing resource */
/**
 * @swagger
 * /listing:
 *  get:
 *    description: Read Route for Favorite resource.
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: path
 *      name: id
 *      description: The id of a given Favorite.
 *    responses:
 *      '200':
 *            description: A json object representing a Listing or a List of Listings.
 *      '500':
 *            description: server error
 */
router.get('/listing', async (req, res) => {
  try {
    if (req.query.id) {
      // if id query param detected return the given Listing
      return res.status(200).json(await ListingModel.findById(req.query.id).exec());
    }
    // return all listings
    return res.status(200).json(await ListingModel.find({}).exec());
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/** Update Route for Listing resource */
router.put('/listing/:listingid', isListingOwner, async (req, res) => {
  try {
    const listingID = req.listing._id;
    const listing = await ListingModel.findByIdAndUpdate(listingID, req.body).exec();
    return res.status(204).json({
      message: 'Document successfully updated.',
      listing,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/** Delete Route for Listing resource */
router.delete('/listing/:listingid', isListingOwner, async (req, res) => {
  try {
    // passed in by isListingOwner Middleware.
    const listingID = req.listing._id;
    await ListingModel.findByIdAndDelete(listingID).exec();
    return res.status(202).json({
      message: `${listingID}, successfully queued for deletion.`,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

module.exports = router;

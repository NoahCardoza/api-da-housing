const express = require('express');
const router = express.Router();
const xml = require('xml');
const ListingModel = require('../models/Listing');

router.get('/xml/listings', async (_, res) => {
    try {
        res.set('Content-Type', 'text/xml');
        res.status(200).send(xml(await ListingModel.find({})))
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

module.exports = router;
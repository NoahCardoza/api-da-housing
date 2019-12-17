const express = require('express');

const router = express.Router();
const FavoriteModel = require('../models/Favorite');
const { auth, isFavoriteAuthor } = require('../middleware');

// todo: a deletion hook on Team deletion needs to be setup in Team model

/** Create Route for Team resource */
router.post('/favorite', auth, async (req, res) => {
  try {
    const { source, name } = req.body;
    return res.status(201)
      .json(await new FavoriteModel({ source, name, author: req.user._id }).save());
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});


/** Read Route for Team resource */
router.get('/favorite/:id', auth, async (req, res) => {
  try {
    return res.status(200).json(await FavoriteModel.findById(req.param.id).exec());
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/** Update Route for Listing resource */
router.put('/favorite/:id', isFavoriteAuthor, async (req, res) => {
  try {
    await FavoriteModel.findByIdAndUpdate(req.param.id, req.body).exec();
    return res.status(204);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/** Delete Route for Listing resource */
router.delete('/favorite/:id', isFavoriteAuthor, async (req, res) => {
  try {
    await FavoriteModel.findByIdAndDelete(req.param.id).exec();
    return res.status(202);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

module.exports = router;

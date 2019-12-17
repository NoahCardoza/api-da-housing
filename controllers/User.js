const express = require('express');

const router = express.Router();
const {
  auth,
} = require('../middleware');
const UserModel = require('../models/User');

/** Create Route for User Resource */
router.post('/user', async (req, res) => {
  try {
    const user = new UserModel(req.body);
    const document = await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({
      document,
      token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});


/** Read Route for User Resource */
router.get('/user', auth, async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/** Update Route for User Resource */
router.put('/user', auth, async (req, res) => {
  try {
    await UserModel.findByIdAndUpdate(req.user.id, req.body).exec();
    return res.status(200).send('Updated');
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/** Delete Route for User Resource */
router.delete('/user', auth, async (req, res) => {
  try {
    await UserModel.findByIdAndRemove(req.user.id).exec();
    return res.status(202).send('Deleted');
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

module.exports = router;

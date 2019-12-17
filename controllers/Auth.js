const express = require('express');
const User = require('../models/User');

const router = express.Router();

/**
 * Grants User Credentials on Successful Authentication.
 */
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user === null) return res.status(400);
    const result = await user.comparePassword(password);
    if (result === true) return res.status(200).json({ token: await user.generateAuthToken() });
    return res.status(401).send('Credentials Have Failed.');
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/**
 * Invalidates Current User Credentials.
 */
router.post('/auth/logout', async (req, res) => {
  try {
    // todo: scan from middleware
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/**
 * Invalidates all User Credentials.
 */
router.post('/auth/logout-all', async (req, res) => {
  try {
    // todo: scan from middleware
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports.Auth = router;

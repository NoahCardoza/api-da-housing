const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware');

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
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

/**
 * Invalidates Current User Credentials.
 */
router.post('/auth/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * Invalidates all User Credentials.
 */
router.post('/auth/logout-all', auth, async (req, res) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

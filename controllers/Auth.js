const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware');

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *  post:
 *    description: Grants User Credentials on Successful Authentication.
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "body"
 *      name: "body"
 *      description: A object containing both the password and email properties
 *      schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      '200':
 *            description: An object containing a valid json web token.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    token:
 *                      type: string
 *      '401':
 *            description: invalid credentials.
 *      '500':
 *            description: server error
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
 * @swagger
 * /auth/logout:
 *  post:
 *    description: Invalidates Current User Credentials.
 *    produces:
 *    - "application/json"
 *    responses:
 *      '202':
 *            description: successfully invalidated current json web token.
 */
router.post('/auth/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
    await req.user.save();
    return res.status(202);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /auth/logout-all:
 *  post:
 *    description: Invalidates all User Credentials.
 *    produces:
 *    - "application/json"
 *    responses:
 *      '202':
 *            description: successfully invalidated all user json web tokens.
 */
router.post('/auth/logout-all', auth, async (req, res) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    return res.status(202);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;

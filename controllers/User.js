const express = require('express');

const router = express.Router();
const { auth } = require('../middleware');
const UserModel = require('../models/User');

/**
 * @swagger
 * /user:
 *  post:
 *    description: Create Route for User resource.
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "body"
 *      name: "body"
 *      description: A object containing email, school, password, gender and name properties.
 *    responses:
 *      '201':
 *            description: An object containing a User.
 *      '500':
 *            description: server error
 */
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

/**
 * @swagger
 * /user:
 *  get:
 *    description: Read Route for current User resource.
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *            description: A json object representing a current User.
 *      '500':
 *            description: server error
 */
router.get('/user', auth, async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /user:
 *  put:
 *    description: Update Route for current User resource.
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: body
 *      name: body
 *      description: an object containing the fields that need updating
 *    responses:
 *      '200':
 *            description: A success response.
 *      '500':
 *            description: server error
 */
router.put('/user', auth, async (req, res) => {
  try {
    await UserModel.findByIdAndUpdate(req.user.id, req.body).exec();
    return res.status(200).send('Updated');
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /user:
 *  delete:
 *    description: Delete Route for current User resource.
 *    produces:
 *    - "application/json"
 *    responses:
 *      '202':
 *            description: successfully deleted
 *      '500':
 *            description: server error
 */
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

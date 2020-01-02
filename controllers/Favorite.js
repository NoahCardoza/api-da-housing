const express = require('express');

const router = express.Router();
const FavoriteModel = require('../models/Favorite');
const { auth, isFavoriteAuthor } = require('../middleware');

// todo: a deletion hook on Team deletion needs to be setup in Team model
// todo: need a favorites test file for mocha and chai!

/**
 * @swagger
 * /favorite:
 *  post:
 *    description: Create Route for Favorite resource.
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "body"
 *      name: "body"
 *      description: A object containing both the source and name, and team properties.
 *      schema:
 *        type: object
 *        properties:
 *          source:
 *            type: string
 *          name:
 *            type: string
 *          team:
 *            type: string
 *    responses:
 *      '201':
 *            description: An object containing a favorite.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    source:
 *                      type: string
 *                    name:
 *                      type: string
 *                    author:
 *                      type: string
 *                    team:
 *                      type: string
 *                    comments:
 *                      type: array
 *                      items:
 *                        type: string
 *      '500':
 *            description: server error
 */
router.post('/favorite', auth, async (req, res) => {
  try {
    const { source, name, team } = req.body;
    return res.status(201).json(
      await new FavoriteModel({
        source,
        name,
        author: req.user._id,
        team,
      }).save(),
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /favorite:
 *  get:
 *    description: Read Route for Favorite resource.
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: path
 *      name: id
 *      description: The id of a given Favorite.
 *      required: true
 *    responses:
 *      '200':
 *            description: A json object representing a Favorite.
 *      '500':
 *            description: server error
 */
router.get('/favorite/:id', auth, async (req, res) => {
  try {
    return res
      .status(200)
      .json(await FavoriteModel.findById(req.param.id).exec());
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /favorite:
 *  put:
 *    description: Update Route for Favorite resource.
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: path
 *      name: id
 *      description: The id of a given Favorite.
 *      required: true
 *    - in: body
 *      name: body
 *      description: an object containing the fields that need updating
 *    responses:
 *      '200':
 *            description: A json object representing a Favorite.
 *      '500':
 *            description: server error
 */
router.put('/favorite/:id', isFavoriteAuthor, async (req, res) => {
  try {
    await FavoriteModel.findByIdAndUpdate(
      req.param.id,
      req.body,
    ).exec();
    return res.status(204);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /favorite:
 *  delete:
 *    description: Delete Route for Favorite resource.
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: path
 *      name: id
 *      description: The id of a given Favorite.
 *      required: true
 *    responses:
 *      '202':
 *            description: successfully deleted
 *      '500':
 *            description: server error
 */
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

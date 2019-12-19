const express = require('express');

const router = express.Router();
const { auth } = require('../middleware');
const OrganizationModel = require('../models/Organization');

/**
 * @swagger
 * /organization:
 *  post:
 *    description: Create Route for organization resource.
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "body"
 *      name: "body"
 *      description: A object containing name, location, members and administrators
 *    responses:
 *      '201':
 *            description: An object containing a Organization
 *      '500':
 *            description: server error
 */
router.post('/organization', auth, async (req, res) => {
  try {
    const organization = new OrganizationModel(req.body);
    await organization.save();
    return res.status(201).json(organization);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

module.exports = router;

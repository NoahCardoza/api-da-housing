const express = require('express');

const router = express.Router();
const TeamModel = require('../models/Team');
const { auth, isTeamMember } = require('../middleware');

/**
 * @swagger
 * /team:
 *  post:
 *    description: Create Route for Team resource.
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "body"
 *      name: "body"
 *      description: A object containing the name,budget and members properties,
 *    responses:
 *      '201':
 *            description: An object containing a Team.
 *      '500':
 *            description: server error
 */
router.post('/team', auth, async (req, res) => {
  try {
    const { name, budget, members } = req.body;
    const team = new TeamModel({ name, budget, members });
    await team.save();
    return res.status(201).json(team);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /team:
 *  get:
 *    description: Read Route for Team resource.
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: path
 *      name: id
 *      description: The id of a given Team.
 *      required: true
 *    responses:
 *      '200':
 *            description: A json object representing a Team.
 *      '500':
 *            description: server error
 */
router.get('/team/:id', isTeamMember, async (req, res) => {
  try {
    return res
      .status(200)
      .json(await TeamModel.findById(req.params.id).exec());
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /team:
 *  put:
 *    description: Update Route for Team resource.
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: path
 *      name: id
 *      description: The id of a given Team.
 *      required: true
 *    - in: body
 *      name: body
 *      description: an object containing the fields that need updating
 *    responses:
 *      '200':
 *            description: A json object representing a Team.
 *      '500':
 *            description: server error
 */
router.put('/team/:id', isTeamMember, async (req, res) => {
  try {
    TeamModel.findByIdAndUpdate(
      req.params.id,
      req.body.TeamModel,
      function(err, updateTeamModel) {
        if (err) {
          return res.status(500).send(err.message);
        } else {
          if (!updateTeamModel) {
            return res.status(500).send(err.message);
          }
        }
      },
    );
    return res
      .status(200)
      .json(
        await TeamModel.findByIdAndUpdate(
          req.params.id,
          req.body,
        ).exec(),
      );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /team:
 *  put:
 *    description: Update Route for Team resource for leaving member.
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: path
 *      name: id
 *      description: The id of a given Team.
 *      required: true
 *    - in: body
 *      name: body
 *      description: an object containing the fields that need updating
 *    responses:
 *      '200':
 *            description: A json object representing a Team.
 *      '500':
 *            description: server error
 */
router.put('/team/leave-team/:id', isTeamMember, async (req, res) => {
  res.send('test');
  try {
    userID = req.user_id;
    userMembers = req.params.members;

    var index = userMembers.indexOf(userID);
    if (index > -1) {
      userMembers.splice(index, 1);
    }

    filter = { _id: req.params.id };
    update = { members: userMembers };

    return res
      .status(200)
      .json(
        (await TeamModel.findOneAndUpdate(filter, update)).exec(),
      );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /team:
 *  delete:
 *    description: Delete Route for Team resource.
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: path
 *      name: id
 *      description: The id of a given Team.
 *      required: true
 *    responses:
 *      '202':
 *            description: successfully deleted
 *      '500':
 *            description: server error
 */
router.delete('/team/:id', isTeamMember, async (req, res) => {
  try {
    // Delete Team by Object ID
    return res
      .status(202)
      .json(await TeamModel.findByIdAndDelete(req.params.id).exec());
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

module.exports = router;

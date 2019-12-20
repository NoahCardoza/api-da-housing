const express = require('express');

const router = express.Router();
const TeamModel = require('../models/Team');
const {
  auth,
  isTeamMember,
} = require('../middleware');




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
    return res.status(200).json(await TeamModel.findById(req.params.id).exec());
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
    TeamModel.findByIdAndUpdate(req.params.id, req.body.TeamModel, function(err, updateTeamModel) {
      if(err) {
        res.redirect("/team")
      } else {
        if(!updateTeamModel) { 
          return res.status(500).send(err.message);
        }
        res.redirect("/team/" + req.params.id);
      }
    })
    return res.status(204)
      .json(await TeamModel.findByIdAndUpdate(req.params.id, req.body).exec());
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
    TeamModel.findByIdAndDelete(req.params.id, function(err){
      if(err){
        back;
        return res.status(500).send(err.message)
      } 
      else {
        return res.status(202)
      }
    })

    return res.status(202).json(await TeamModel.findByIdAndDelete(req.params.id).exec());

  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

// todo: Favorites is not its own resource and should be used accordingly
// todo: /team/delete-favorite/:id, /team/favorites/:id, /team/add-favorite/:id

module.exports = router;

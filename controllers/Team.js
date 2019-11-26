const express = require('express');

const router = express.Router();
const TeamModel = require('../models/Team');
const {
  auth,
  isTeamMember,
} = require('../middleware');


/**
 * retrieve a team by id.
 */
router.get('/team/:id', isTeamMember, async (req, res) => {
  try {
    return res.status(200).json(await TeamModel.findById(req.params.id).exec());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

/**
 * create a team if you're a user.
 */
router.post('/team/create-team', auth, async (req, res) => {
  try {
    const { name, budget } = req.body;
    return res.status(201)
      .json(await new TeamModel({ name, budget, members: [req.user._id] }).save());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

/**
 * update a team by id.
 */
router.put('/team/update-team/:id', isTeamMember, async (req, res) => {
  try {
    return res.status(204)
      .json(await TeamModel.findByIdAndUpdate(req.params.id, req.body).exec());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});


/**
 * It should delete a team.
 */
router.delete('/team/:id', isTeamMember, async (req, res) => {
  try {
    return res.status(202).json(await TeamModel.findByIdAndDelete(req.params.id).exec());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

module.exports = router;

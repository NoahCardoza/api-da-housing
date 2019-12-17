const express = require('express');

const router = express.Router();
const TeamModel = require('../models/Team');
const {
  auth,
  isTeamMember,
} = require('../middleware');

/** Create Route for Team resource */
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

/** Read Route for Team resource */
router.get('/team/:id', isTeamMember, async (req, res) => {
  try {
    return res.status(200).json(await TeamModel.findById(req.params.id).exec());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

/** Update Route for Team resource */
router.put('/team/update-team/:id', isTeamMember, async (req, res) => {
  try {
    return res.status(204)
      .json(await TeamModel.findByIdAndUpdate(req.params.id, req.body).exec());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});


/** Delete Route for Team resource */
router.delete('/team/:id', isTeamMember, async (req, res) => {
  try {
    return res.status(202).json(await TeamModel.findByIdAndDelete(req.params.id).exec());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

// todo: /team/delete-favorite/:id, /team/favorites/:id, /team/add-favorite/:id

module.exports = router;

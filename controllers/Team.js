const express = require('express');

const router = express.Router();
const TeamModel = require('../models/Team');
const {
  auth,
  isTeamMember,
} = require('../middleware');

/** Create Route for Team resource */
router.post('/team', auth, async (req, res) => {
  try {
    const { name, budget } = req.body;
    return res.status(201)
      .json(await new TeamModel({ name, budget, members: [req.user._id] }).save());
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/** Read Route for Team resource */
router.get('/team/:id', isTeamMember, async (req, res) => {
  try {
    return res.status(200).json(await TeamModel.findById(req.params.id).exec());
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

/** Update Route for Team resource */
router.put('/team/:id', isTeamMember, async (req, res) => {
  try {
    return res.status(204)
      .json(await TeamModel.findByIdAndUpdate(req.params.id, req.body).exec());
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});


/** Delete Route for Team resource */
router.delete('/team/:id', isTeamMember, async (req, res) => {
  try {
    return res.status(202).json(await TeamModel.findByIdAndDelete(req.params.id).exec());
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

// todo: /team/delete-favorite/:id, /team/favorites/:id, /team/add-favorite/:id

module.exports = router;

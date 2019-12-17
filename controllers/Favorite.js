const express = require('express');

const router = express.Router();
const FavoriteModel = require('../models/Favorite');
const { auth } = require('../middleware');


// const FavoriteSchema = new mongoose.Schema({
//     source: {
//       required: true,
//       type: String,
//     },
//     name: {
//       required: true,
//       type: String,
//     },
//     comments: [String],
//   });
  

/** Create Route for Team resource */
router.post('/favorite', auth, async (req, res) => {
    try {
      const { name, budget } = req.body;
      return res.status(201)
        .json(await new TeamModel({ name, budget, members: [req.user._id] }).save());
    } catch (err) {
      console.error(err.message);
      return res.status(500).send(err.message);
    }
  });

module.exports = router;

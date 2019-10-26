const express = require('express');
const router = express.Router();
const {
    userModel
} = require('../models/User');

router.get('/', async (_, res) => {
    res.status(200).send('response');
});

router.post('/', async (req, res) => {
    try {
        const {
            password
        } = req.body;
        const user = new userModel({
            password
        });
        const doc = await user.save();
        res.status(201).json(doc);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

module.exports = router;
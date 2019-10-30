const express = require('express');
const router = express.Router();
const {
    userModel
} = require('../models/User');

router.post('/create-user', async (req, res) => {
    try {
        const {
            password,
            email,
            school,
            gender
        } = req.body;
        const user = new userModel({
            password,
            email,
            school,
            gender
        });
        const doc = await user.save();
        res.status(201).json(doc);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;
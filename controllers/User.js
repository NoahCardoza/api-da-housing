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
            gender,
            name
        } = req.body;
        const user = new userModel({
            password,
            email,
            school,
            gender,
            name
        });
        const user = await user.save();
        const token = await user.generateAuthToken();
        res.status(201).json({
            user,
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

router.post('/login-user', async (req, res) => {
    try {

    } catch (error) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;
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
        document = await user.save();
        const token = await user.generateAuthToken();
        res.status(201).json({
            document,
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

router.post('/login-user', async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;
        const user = await userModel.find({
            email
        });
        if (!user) return res.status(400);
        if (user.comparePassword(password)) {
            const token = await user.generateAuthToken();
            res.send({
                document: user,
                token
            })
        } else {
            res.status(401).send("Credentials have failed.")
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

module.exports = router;
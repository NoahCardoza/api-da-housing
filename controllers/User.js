const express = require('express');
const router = express.Router();
const {
    auth
} = require('../middleware');
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
        const document = await userModel.findOne({
            email
        });
        if (!document) return res.status(400);
        const comparedResult = await document.comparePassword(password);
        if (comparedResult) return res.status(200).json({
            document,
            token: await document.generateAuthToken()
        });
        if (!comparedResult) return res.status(401).send("Credentials have failed.");
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// example of middleware. also personal profile
router.get('/get-me', auth, async (req, res) => {
    return res.status(200).json(req.user);
});


module.exports = router;
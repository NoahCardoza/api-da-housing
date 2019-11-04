const express = require('express');
const router = express.Router();
const {
    auth
} = require('../middleware');
const {
    userModel
} = require('../models/User');
// Create
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

// Login
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

// Update
router.put('/update-user', auth,async(req, res)=>{
    await userModel.findByIdAndUpdate(req.user.id,req.body,{new:true},function(err,userModel){
        if(err) return res.status(500).send(err);
        return res.send(userModel);
    });
    return res.status(200).send('Updated');
});

// Delete
router.delete('/delete-user', auth, async(req, res)=>{
    userModel.findByIdAndRemove(req.user.id,(err,userModel)=>{
        if (err) return res.status(500).send(err);
    }); 
    return res.status(200).send('Deleted');
})


// example of middleware. also personal profile.
router.get('/get-me-user', auth, async (req, res) => {
    return res.status(200).json(req.user);
});

// logs out 
router.post('/logout-user', auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
});

router.post('/logout-all-user', auth, async (req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
});


module.exports = router;
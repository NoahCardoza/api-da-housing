const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    school: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, name : {
        type: String, 
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified("password")) return next();
        let hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    } catch (err) {
        console.log(err);
    }
});

userSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id: this._id}, process.env.SECRET); 
        // allows user to be logged in on multiple devices 
        this.tokens = this.tokens.push({ token })
        await this.save();
        return token; 
    }
    catch(err){
        console.err(err);
    }
}

userSchema.methods.comparePassword = async function (plaintext) {
    try {
        return await bcrypt.compare(plaintext, this.password);
    } catch (err) {
        console.error(err);
        return err;
    }
};

module.exports.userModel = mongoose.model('user', userSchema);
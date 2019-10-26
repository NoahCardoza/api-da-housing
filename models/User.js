const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    password: {
        type: String,
        required: true
    }
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

userSchema.methods.comparePassword = async function (plaintext) {
    try {
        return await bcrypt.compare(plaintext, this.password);
    } catch (err) {
        console.error(err);
        return err;
    }
};

module.exports.userModel = mongoose.model('user', userSchema);
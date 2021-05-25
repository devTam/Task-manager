const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is not valid')
            }
        }
    },
    password: {
        type: String,
        required:true,
        trim: true,
        validate(value) {
            if(!validator.isLength(value, 8)) {
                throw new Error('Password must be at least 8 digits long')
            }
        }
    },
    age: {
        type: Number,
        default: 0 
    }
})

userSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

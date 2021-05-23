const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
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
});

module.exports = User;

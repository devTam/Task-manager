const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// authenticate user custom function, N/B .statics are accessible on the models 
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) throw new Error('Unable to login!')

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) throw new Error('Unable to login');

    return user;
}

// This removes the password and tokens from every response in every route
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

// Generate token N/B .methods are accessible on instances
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, 'taskmanager');

    user.tokens = user.tokens.concat({ token });
    await user.save(); 
    return token;
}

// hash password
userSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
